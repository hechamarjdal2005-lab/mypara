/* =====================================================================
   MY PARA — cart
   cart.js
   ---------------------------------------------------------------------
   Responsibilities:
     1. Cart state persisted in localStorage (survives every page).
     2. Render the cart UI: bottom sheet on phones, side drawer on desktop.
     3. Add / increment / decrement / remove, live totals, free-shipping
        meter, empty state.
     4. Compose a formatted WhatsApp order message and hand the customer
        off to wa.me without leaving the site.
     5. Expose a tiny public API (MyParaCart) used by the rest of the site.

   Markup the cart expects (see every page — injected by cart.js if
   missing, so pages only need <body data-page="...">):

     .cart-overlay[data-cart-overlay]
     .cart[data-cart]
        .cart__head  h2 + [data-cart-count] + [data-cart-close]
        .cart__ship  [data-ship-text] + [data-ship-bar]
        .cart__body  [data-cart-list]
        .cart__foot  [data-cart-total] + [data-cart-save] + [data-cart-order]
   ===================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "mypara.cart.v1";
  var MAX_QTY = 20;

  /* -----------------------------------------------------------------
     State
     ------------------------------------------------------------------ */
  var cart = load();

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // drop anything that no longer exists in the catalogue
      return parsed
        .filter(function (l) { return l && getProduct(l.id); })
        .map(function (l) {
          return { id: String(l.id), qty: Math.max(1, Math.min(MAX_QTY, parseInt(l.qty, 10) || 1)) };
        });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      /* private mode / quota — the cart still works for this page view */
    }
  }

  /* -----------------------------------------------------------------
     DOM references (lazily queried so the script can load in <head>)
     ------------------------------------------------------------------ */
  var dom = {};

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function collect() {
    dom.overlay = q("[data-cart-overlay]");
    dom.sheet = q("[data-cart]");
    dom.list = q("[data-cart-list]");
    dom.total = q("[data-cart-total]");
    dom.count = q("[data-cart-count]");
    dom.save = q("[data-cart-save]");
    dom.shipBar = q("[data-ship-bar]");
    dom.shipText = q("[data-ship-text]");
    dom.orderBtn = q("[data-cart-order]");
    dom.buttons = qa("[data-cart-btn]");
  }

  /* -----------------------------------------------------------------
     Public API
     ------------------------------------------------------------------ */
  var MyParaCart = {
    add: add,
    setQty: setQty,
    remove: remove,
    clear: clear,
    toggle: toggle,
    open: open,
    close: close,
    count: count,
    subtotal: subtotal,
    savings: savings,
    items: items,
    MAX_QTY: MAX_QTY,
    onChange: function (fn) { listeners.push(fn); },
    isOpen: function () { return !!(dom.sheet && dom.sheet.classList.contains("is-open")); }
  };

  var listeners = [];

  function count() {
    return cart.reduce(function (n, l) { return n + l.qty; }, 0);
  }

  function subtotal() {
    return cart.reduce(function (n, l) {
      var p = getProduct(l.id);
      return n + (p ? p.price * l.qty : 0);
    }, 0);
  }

  function savings() {
    return cart.reduce(function (n, l) {
      var p = getProduct(l.id);
      return n + (p && p.was ? Math.max(0, p.was - p.price) * l.qty : 0);
    }, 0);
  }

  /** Expanded line items, ready for rendering. */
  function items() {
    return cart
      .map(function (l) {
        var p = getProduct(l.id);
        if (!p) return null;
        return { product: p, qty: l.qty, lineTotal: p.price * l.qty };
      })
      .filter(Boolean);
  }

  /* -----------------------------------------------------------------
     Mutations
     ------------------------------------------------------------------ */
  function add(id, qty) {
    var p = getProduct(id);
    if (!p) return false;
    var n = Math.max(1, qty || 1);
    var line = cart.find(function (l) { return l.id === String(id); });
    var capped = false;
    if (line) {
      capped = line.qty >= MAX_QTY;
      line.qty = Math.min(MAX_QTY, line.qty + n);
    } else {
      capped = n > MAX_QTY;
      cart.push({ id: String(id), qty: Math.min(MAX_QTY, n) });
    }
    commit({ added: p, capped: capped, max: MAX_QTY });
    return true;
  }

  function setQty(id, qty) {
    var line = cart.find(function (l) { return l.id === String(id); });
    if (!line) return;
    var n = parseInt(qty, 10) || 0;
    if (n <= 0) return remove(id);
    var capped = n > MAX_QTY;
    line.qty = Math.min(MAX_QTY, n);
    commit({ capped: capped, max: MAX_QTY });
  }

  function remove(id) {
    cart = cart.filter(function (l) { return l.id !== String(id); });
    commit({ removed: id });
  }

  function clear() {
    cart = [];
    commit({ cleared: true });
  }

  function toggle() {
    if (MyParaCart.isOpen()) close();
    else open();
  }

  /** Persist + repaint everything that depends on the cart. */
  function commit(evt) {
    save();
    render();
    listeners.forEach(function (fn) {
      try { fn(items(), evt || {}); } catch (e) { /* never break the page */ }
    });
  }

  /* -----------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------ */
  function render() {
    var n = count();
    var sub = subtotal();

    // navbar + mobile bar badges
    qa(".cart-badge").forEach(function (b) {
      b.textContent = n > 99 ? "99+" : String(n);
      b.classList.toggle("is-on", n > 0);
    });
    qa("[data-cart-btn]").forEach(function (b) {
      b.setAttribute("aria-label", n === 0 ? "Ouvrir le panier" : "Ouvrir le panier, " + n + (n > 1 ? " articles" : " article"));
    });

    if (dom.count) dom.count.textContent = n === 0 ? "Panier vide" : n + (n > 1 ? " articles" : " article");

    if (dom.total) dom.total.innerHTML = formatPrice(sub).replace(/\s*DH$/, "") + "<small> " + SHOP.currency + "</small>";

    if (dom.save) {
      var sv = savings();
      dom.save.textContent = sv > 0 ? "Vous économisez " + formatPrice(sv) : "";
      dom.save.style.display = sv > 0 ? "block" : "none";
    }

    // free-shipping progress meter
    if (dom.shipBar) {
      var pct = Math.min(100, Math.round((sub / SHOP.freeShippingFrom) * 100));
      dom.shipBar.style.width = (sub === 0 ? 0 : Math.max(6, pct)) + "%";
    }
    if (dom.shipText) {
      dom.shipText.textContent = sub >= SHOP.freeShippingFrom
        ? "Livraison offerte à Béni Mellal ✓"
        : "Plus que " + formatPrice(SHOP.freeShippingFrom - sub) + " pour la livraison offerte";
    }

    // A checkout button that cannot do anything must look and behave disabled.
    if (dom.orderBtn) {
      dom.orderBtn.classList.toggle("is-disabled", n === 0);
      dom.orderBtn.disabled = n === 0;
      dom.orderBtn.setAttribute("aria-disabled", n === 0 ? "true" : "false");
      dom.orderBtn.title = n === 0 ? "Ajoutez au moins un produit pour commander" : "";
    }

    if (!dom.list) return;

    // Keep the reader's place: the list is rebuilt on every change, which would
    // otherwise reset the scroll offset and throw focus back to <body>.
    var listScroll = dom.list.scrollTop;
    var focused = document.activeElement;
    var keep = null;
    if (focused && dom.list.contains(focused)) {
      var lineEl = focused.closest("[data-line]");
      keep = {
        id: lineEl ? lineEl.getAttribute("data-line") : null,
        action: focused.hasAttribute("data-inc") ? "data-inc"
              : focused.hasAttribute("data-dec") ? "data-dec"
              : focused.hasAttribute("data-rm") ? "data-rm" : null
      };
    }

    dom.list.innerHTML = n === 0 ? emptyStateHTML() : linesHTML();
    dom.list.scrollTop = listScroll;

    if (keep && keep.id && keep.action) {
      var next = dom.list.querySelector(
        '[data-line="' + (window.CSS && CSS.escape ? CSS.escape(keep.id) : keep.id) + '"] ' + keep.action
      );
      if (next) next.focus({ preventScroll: true });
    }
  }

  function emptyStateHTML() {
    return (
      '<div class="cart__empty">' +
        '<div class="ic">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
        "</div>" +
        "<h3>Votre panier est vide</h3>" +
        "<p>Ajoutez vos soins préférés, puis commandez en un clic sur WhatsApp.</p>" +
        '<a class="btn btn--mint btn--sm" href="shop.html" data-cart-close>Découvrir la boutique</a>' +
      "</div>"
    );
  }

  function linesHTML() {
    return items()
      .map(function (it) {
        var p = it.product;
        var cat = getCategory(p.cat);
        var art = p.image
          ? '<img src="' + p.image + '" alt="' + esc(p.name) + '" loading="lazy">'
          : productArt(p);
        return (
          '<div class="cline" data-line="' + p.id + '">' +
            '<div class="cline__media">' + art + "</div>" +
            '<div class="cline__body">' +
              '<div class="cline__brand">' + esc(p.brand) + (cat ? " · " + esc(cat.short) : "") + "</div>" +
              '<div class="cline__name">' + esc(p.name) + "</div>" +
              '<div class="cline__row">' +
                  '<div class="qty">' +
                    '<button type="button" data-dec aria-label="Retirer un ' + esc(p.name) + '">' +
                      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>' +
                    "</button>" +
                    '<span class="v" data-qty aria-live="polite">' + it.qty + "</span>" +
                    '<button type="button" data-inc aria-label="Ajouter un ' + esc(p.name) + '"' +
                      (it.qty >= MAX_QTY ? ' disabled title="Maximum ' + MAX_QTY + ' par produit"' : "") + ">" +
                      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' +
                    "</button>" +
                  "</div>" +
                '<span class="cline__price">' + formatPrice(it.lineTotal) + "</span>" +
                '<button type="button" class="cline__rm" data-rm aria-label="Supprimer ' + esc(p.name) + '">' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>' +
                  "Supprimer" +
                "</button>" +
              "</div>" +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* -----------------------------------------------------------------
     Open / close
     ------------------------------------------------------------------ */
  function open() {
    if (!dom.sheet) return;
    lastTrigger = document.activeElement && document.activeElement !== document.body
      ? document.activeElement
      : null;
    dom.sheet.classList.add("is-open");
    if (dom.overlay) dom.overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
    dom.sheet.setAttribute("aria-hidden", "false");
    // focus the close button for keyboard users
    var c = q("[data-cart-close]", dom.sheet);
    if (c) setTimeout(function () { c.focus({ preventScroll: true }); }, 260);
  }

  function close() {
    if (!dom.sheet) return;
    dom.sheet.classList.remove("is-open");
    if (dom.overlay) dom.overlay.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    dom.sheet.setAttribute("aria-hidden", "true");
    // hand focus back to whatever opened the cart
    if (lastTrigger && document.contains(lastTrigger)) {
      try { lastTrigger.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
    lastTrigger = null;
  }

  var lastTrigger = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

  /** Keep Tab inside the sheet — otherwise focus escapes to the page behind. */
  function trapFocus(e) {
    if (e.key !== "Tab" || !MyParaCart.isOpen()) return;
    var nodes = qa(FOCUSABLE, dom.sheet).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* -----------------------------------------------------------------
     WhatsApp order
     ------------------------------------------------------------------ */
  function orderMessage() {
    var list = items();
    if (!list.length) return "";
    var lines = list.map(function (it) {
      return "- " + it.product.brand + " " + it.product.name +
             (it.product.ml ? " (" + it.product.ml + ")" : "") +
             " (x" + it.qty + ") : " + formatPrice(it.lineTotal);
    });
    var sub = subtotal();
    var msg =
      "Bonjour My Para, je souhaite commander :\n\n" +
      lines.join("\n") +
      "\n\nTotal : " + formatPrice(sub) +
      "\nLivraison à : Béni Mellal" +
      "\n\nMerci de me confirmer la disponibilité et le délai de livraison.";
    return encodeURIComponent(msg);
  }

  function goWhatsApp() {
    if (!count()) {
      window.location.href = "shop.html";
      return;
    }
    window.open("https://wa.me/" + SHOP.whatsappNumber + "?text=" + orderMessage(), "_blank", "noopener");
  }

  /* -----------------------------------------------------------------
     Feedback: bump the cart icons, pulse the badge
     ------------------------------------------------------------------ */
  function bumpIcons() {
    qa("[data-cart-btn]").forEach(function (b) {
      b.classList.remove("is-bump");
      void b.offsetWidth;          // restart the animation
      b.classList.add("is-bump");
    });
    qa(".cart-badge").forEach(function (b) {
      b.classList.remove("is-pulse");
      void b.offsetWidth;
      b.classList.add("is-pulse");
    });
  }

  /* -----------------------------------------------------------------
     Toast (created on demand, lives above everything)
     ------------------------------------------------------------------ */
  function toast(msg, sub) {
    var wrap = q(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML =
      '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>' +
      "<span><b>" + esc(msg) + "</b>" + (sub ? '<br><span class="sub">' + esc(sub) + "</span>" : "") + "</span>";
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () { el.remove(); }, 320);
    }, 2400);
  }

  /* -----------------------------------------------------------------
     Wiring
     ------------------------------------------------------------------ */
  function bind() {
    // open / close triggers (delegated: works for every page + added nodes)
    document.addEventListener("click", function (e) {
      var openBtn = e.target.closest("[data-cart-btn]");
      if (openBtn) {
        e.preventDefault();
        open();
        return;
      }
      var closeBtn = e.target.closest("[data-cart-close]");
      if (closeBtn) {
        // the empty-state CTA is a real link: let it navigate
        if (closeBtn.tagName === "A" && closeBtn.getAttribute("href")) {
          close();
          return;
        }
        e.preventDefault();
        close();
        return;
      }
      if (e.target.closest("[data-cart-overlay]")) { close(); return; }
      if (e.target.closest("[data-cart-order]")) {
        e.preventDefault();
        if (!count()) { toast("Panier vide", "Ajoutez un produit avant de commander."); return; }
        goWhatsApp();
        return;
      }

      // quantity + remove, inside the sheet
      var line = e.target.closest("[data-line]");
      if (!line) return;
      var id = line.getAttribute("data-line");
      if (e.target.closest("[data-inc]")) {
        var cur = cart.find(function (l) { return l.id === id; });
        if (cur) {
          if (cur.qty >= MAX_QTY) {
            toast("Maximum " + MAX_QTY, "Contactez-nous pour une plus grande quantité.");
            return;
          }
          setQty(id, cur.qty + 1);
        } else add(id, 1);
      } else if (e.target.closest("[data-dec]")) {
        var c2 = cart.find(function (l) { return l.id === id; });
        if (c2) setQty(id, c2.qty - 1);
      } else if (e.target.closest("[data-rm]")) {
        var prod = getProduct(id);
        remove(id);
        toast("Retiré du panier", (prod || {}).name || "Produit");
      }
    });

    // keyboard
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && MyParaCart.isOpen()) { close(); return; }
      trapFocus(e);
    });

    // another tab changed the cart
    window.addEventListener("storage", function (e) {
      if (e.key === STORAGE_KEY) {
        cart = load();
        render();
      }
    });
  }

  /* -----------------------------------------------------------------
     Boot — works whether the script is in <head> or before </body>
     ------------------------------------------------------------------ */
  function init() {
    collect();
    bind();
    render();
    // only pulse the icons when something was actually added
    MyParaCart.onChange(function (items, evt) {
      if (evt && evt.added) bumpIcons();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.MyParaCart = MyParaCart;
})();
