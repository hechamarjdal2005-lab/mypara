/* =====================================================================
   MY PARA — general interactions & animations
   script.js
   ---------------------------------------------------------------------
   1. helpers + product card renderer
   2. sticky nav, scroll progress, page transitions
   3. slide-in mobile menu
   4. scroll reveal (IntersectionObserver) + stagger
   5. animated counters, animated star ratings, review bars
   6. hero shelf + floating particles
   7. brand carousel (arrows, drag, gentle auto-advance)
   8. add-to-cart buttons + toasts
   9. shop page: category filter, search, sort, render
   10. FAQ accordion, opening-hours today, contact form
   ===================================================================== */

(function () {
  "use strict";

  /* -------------------------------------------------------------------
     0. Helpers
     ------------------------------------------------------------------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** "Eucerin Aquaporin" -> "eucerin aquaporin" (accents + case folded) */
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  var ICONS = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3c0 4.5-6 7.5-6 13a6 6 0 0 0 12 0c0-5.5-6-8.5-6-13Z"/><path d="M13 6.5 8 3"/><rect x="6.4" y="1.6" width="2.2" height="4.6" rx="1.1"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15 5 17 4.5 19 2c1 2 2 4.2 2 8a7 7 0 0 1-7 7Z"/><path d="M2 21c0-3 1.9-5.6 4.5-7C9 12.8 12 12 15 12"/></svg>',
    pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 12 5.5 5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z"/></svg>',
    star: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9Z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    chevD: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1 5.2-2.4a1.2 1.2 0 0 1 2.4 0C13.3 4 16 5 18 5a1 1 0 0 1 1 1Z"/><path d="m9 12 2 2 4-4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17V5a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1"/><path d="M14 9h4l4 4v4h-3"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/><path d="M14 17h-5.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4-.9L3 20.5l1.6-4.6A8.3 8.3 0 0 1 3.6 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 8.4 8.4Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7 0a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.2 3.2 0 0 0-1 2.4 5.5 5.5 0 0 0 1.2 2.9 12.7 12.7 0 0 0 4.8 4.3c.7.3 1.2.5 1.6.6a4 4 0 0 0 1.8.1 2.9 2.9 0 0 0 1.9-1.3 2.4 2.4 0 0 0 .2-1.3c-.1-.1-.3-.2-.6-.3Z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>'
  };

  /* -------------------------------------------------------------------
     1. Product card renderer
     Shared by the homepage (featured) and shop.html (full grid).
     ------------------------------------------------------------------- */
  function productCardHTML(p, opts) {
    opts = opts || {};
    var off = discountOf(p);
    var flags = "";
    if (p.badge === "promo" || off) flags += '<span class="badge badge--promo">-' + off + '%</span>';
    else if (p.badge === "top") flags += '<span class="badge badge--top">Best-seller</span>';
    else if (p.badge === "new") flags += '<span class="badge badge--new">Nouveau</span>';
    if (p.badge === "advice") flags += '<span class="badge badge--advice">' + ICONS.drop + "Conseillée</span>";

    var art = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy">'
      : productArt(p);

    return (
      '<article class="card" data-id="' + p.id + '"' +
        (opts.reveal === false ? "" : ' data-reveal') +
        (opts.delay ? ' style="--d:' + opts.delay + 'ms"' : "") + ">" +
        '<div class="card__media card__media--' + (p.tint || "mint") + '">' +
          (flags ? '<div class="card__flags">' + flags + "</div>" : "") +
          '<button class="card__fav" type="button" aria-label="Ajouter aux favoris">' + ICONS.heart + "</button>" +
          art +
        "</div>" +
        '<div class="card__body">' +
          '<div class="card__brand">' + p.brand + "</div>" +
          '<h3 class="card__name">' + p.name + "</h3>" +
          (p.ml ? '<div class="card__ml">' + p.ml + "</div>" : "") +
          '<div class="card__foot">' +
            '<div class="card__price">' +
              '<span class="card__now num">' + formatPrice(p.price) + "</span>" +
              (p.was ? '<span class="card__was num">' + formatPrice(p.was) + "</span>" : "") +
            "</div>" +
            '<button class="add-btn" type="button" data-add="' + p.id + '">' + ICONS.cart + "Ajouter au panier</button>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }
  window.productCardHTML = productCardHTML;

  /* -------------------------------------------------------------------
     2. Sticky nav, mobile action bar, page transitions
     ------------------------------------------------------------------- */
  function initChrome() {
    var nav = $(".nav");
    var bar = $(".mobile-bar");
    var hero = $(".hero");
    var ticking = false;

    function onScroll() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (nav) nav.classList.toggle("is-stuck", y > 8);
      if (bar) bar.classList.toggle("is-on", y > (hero ? hero.offsetHeight * 0.55 : 420));
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();

    // soft page transition between the html pages
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (/^(#|mailto:|tel:|https?:)/.test(href) && !/\.html$/.test(href)) return;
      if (!/\.html(\?.*)?$/.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(function () { window.location.href = href; }, 200);
    });
  }

  /* -------------------------------------------------------------------
     3. Slide-in mobile menu
     ------------------------------------------------------------------- */
  function initMenu() {
    var burger = $("#burger");
    if (!burger) return;
    function set(open) {
      document.body.classList.toggle("menu-open", open);
      document.body.classList.toggle("is-locked", open);
      burger.setAttribute("aria-expanded", String(open));
    }
    burger.addEventListener("click", function () { set(!document.body.classList.contains("menu-open")); });
    $$(".nav-menu a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) set(false);
    });
  }

  /* -------------------------------------------------------------------
     4. Scroll reveal
     ------------------------------------------------------------------- */
  function initReveal() {
    var nodes = $$("[data-reveal], .stagger");
    if (!("IntersectionObserver" in window) || REDUCED) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  /* -------------------------------------------------------------------
     5. Counters, stars, review bars
     ------------------------------------------------------------------- */
  function initCounters() {
    var nodes = $$("[data-count]");
    if (!nodes.length) return;

    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
      if (REDUCED) { el.textContent = target.toFixed(dec); return; }
      var dur = 1600;
      var t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);        // easeOutCubic
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) { nodes.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    nodes.forEach(function (n) { io.observe(n); });
  }

  function initRatings() {
    buildStars();

    // stars + distribution bars light up when the reviews block scrolls in
    var blocks = $$("[data-rating-block]");
    if (!("IntersectionObserver" in window) || REDUCED) {
      blocks.forEach(function (b) { b.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    blocks.forEach(function (b) { io.observe(b); });
  }

  /**
   * Fill every .stars element with real star SVGs.
   *   .stars__track  -> grey stars with a gold overlay clipped by --w
   *   plain .stars    -> n solid gold stars (n from --n, default 5)
   */
  function buildStars() {
    $$(".stars").forEach(function (el) {
      if (el.dataset.starsBuilt) return;
      el.dataset.starsBuilt = "1";
      var n = parseInt(el.getAttribute("--n") || el.getAttribute("data-stars") || "5", 10);
      var row = "";
      for (var i = 0; i < n; i++) row += ICONS.star;
      if (el.classList.contains("stars__track")) {
        var w = el.style.getPropertyValue("--w") || "100%";
        el.style.setProperty("--w", w);
        el.innerHTML = '<span class="stars__base">' + row + "</span>" +
                       '<span class="stars__fill">' + row + "</span>";
      } else {
        el.style.color = "var(--gold)";
        el.innerHTML = row;
      }
    });
  }

  /* -------------------------------------------------------------------
     6. Hero: shelf tiles + floating particles
     ------------------------------------------------------------------- */
  function initHero() {
    // floating leaves / droppers / dots
    var host = $("[data-particles]");
    if (host && !REDUCED) {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < 9; i++) {
        var kind = i % 3 === 0 ? "drop" : i % 3 === 1 ? "leaf" : "dot";
        var size = kind === "dot" ? 7 + Math.random() * 7 : 20 + Math.random() * 26;
        var el = document.createElement("span");
        el.className = "part part--" + kind;
        el.style.width = size + "px";
        el.style.height = size + "px";
        el.style.left = (4 + Math.random() * 92) + "%";
        el.style.top = (52 + Math.random() * 46) + "%";
        el.style.animationDuration = (15 + Math.random() * 12) + "s";
        el.style.animationDelay = (-Math.random() * 20) + "s";
        el.innerHTML = kind === "dot"
          ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="currentColor"/></svg>'
          : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            (kind === "leaf"
              ? '<path d="M11 20A7 7 0 0 1 9.8 6.1C15 5 17 4.5 19 2c1 2 2 4.2 2 8a7 7 0 0 1-7 7Z"/><path d="M2 21c0-3 1.9-5.6 4.5-7C9 12.8 12 12 15 12"/>'
              : '<path d="M16 3c0 4.5-6 7.5-6 13a6 6 0 0 0 12 0c0-5.5-6-8.5-6-13Z"/><path d="M13 6.5 8 3"/><rect x="6.4" y="1.6" width="2.2" height="4.6" rx="1.1"/>') +
            "</svg>";
        frag.appendChild(el);
      }
      host.appendChild(frag);
    }

    // the "shelf" of real catalogue tiles
    var shelf = $("[data-shelf]");
    if (shelf && typeof shelfProducts === "function") {
      shelf.innerHTML = shelfProducts()
        .map(function (p, i) {
          return (
            '<div class="shelf-tile' + (i === 1 ? " shelf-tile--tall" : "") + '" data-rise style="--d:' + (0.85 + i * 0.12) + 's">' +
              '<div class="card__media card__media--' + (p.tint || "mint") + '">' + productArt(p) + "</div>" +
              '<div class="shelf-tile__brand">' + p.brand + "</div>" +
              '<div class="shelf-tile__price num">' + formatPrice(p.price) + "</div>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  /* -------------------------------------------------------------------
     7. Brand carousel: arrows, drag, gentle auto-advance
     ------------------------------------------------------------------- */
  function initBrands() {
    var track = $("[data-brand-track]");
    if (!track) return;

    function step() {
      var first = track.firstElementChild;
      if (!first) return 320;
      var gap = parseFloat(getComputedStyle(track).columnGap || "12") || 12;
      return first.getBoundingClientRect().width + gap;
    }
    function updateArrows() {
      var max = track.scrollWidth - track.clientWidth - 4;
      var prev = $("[data-brand-prev]");
      var next = $("[data-brand-next]");
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    var prev = $("[data-brand-prev]");
    var next = $("[data-brand-next]");
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step() * 2, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step() * 2, behavior: "smooth" }); });
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();

    // drag to scroll (mouse + touch)
    var down = false, startX = 0, startLeft = 0, moved = 0;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return;      // native touch scroll is better
      down = true; moved = 0;
      startX = e.clientX;
      startLeft = track.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      if (moved > 4) track.classList.add("is-dragging");
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener("pointerup", function () {
      if (down) track.classList.remove("is-dragging");
      down = false;
    });
    track.addEventListener("click", function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // slow auto-advance; pauses on hover, focus, drag or when off-screen
    if (!REDUCED) {
      var paused = false, raf = null, last = 0;
      track.addEventListener("pointerenter", function () { paused = true; });
      track.addEventListener("pointerleave", function () { paused = false; });
      track.addEventListener("focusin", function () { paused = true; });
      track.addEventListener("focusout", function () { paused = false; });
      function loop(ts) {
        if (!paused && !down && document.body.classList.contains("menu-open") === false) {
          if (ts - last > 22) {
            last = ts;
            var max = track.scrollWidth - track.clientWidth;
            if (max > 4) {
              track.scrollLeft += 0.45;
              if (track.scrollLeft >= max) track.scrollLeft = 0;
            }
          }
        }
        raf = requestAnimationFrame(loop);
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { cancelAnimationFrame(raf); }
        else { last = 0; raf = requestAnimationFrame(loop); }
      });
      raf = requestAnimationFrame(loop);
    }
  }

  /* -------------------------------------------------------------------
     8. Add to cart + toast
     ------------------------------------------------------------------- */
  function initAddToCart() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-add]");
      if (!btn) return;
      e.preventDefault();
      var p = getProduct(btn.getAttribute("data-add"));
      if (!p || !window.MyParaCart) return;

      MyParaCart.add(p.id, 1);

      btn.classList.add("is-added");
      btn.innerHTML = ICONS.check + "Ajouté";
      btn.classList.add("is-pop");
      setTimeout(function () {
        btn.classList.remove("is-added", "is-pop");
        btn.innerHTML = ICONS.cart + "Ajouter au panier";
      }, 1500);

      toast("Ajouté au panier", p.name + " · " + formatPrice(p.price));
    });

    // favourites are a friendly local no-op (no account on a 5-page site)
    document.addEventListener("click", function (e) {
      var fav = e.target.closest(".card__fav");
      if (!fav) return;
      e.preventDefault();
      fav.classList.toggle("is-on");
      toast(fav.classList.contains("is-on") ? "Ajouté à vos favoris" : "Retiré de vos favoris");
    });
  }

  function toast(msg, sub) {
    var wrap = $(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap";
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="ic">' + ICONS.check + "</span><span><b>" + msg + "</b>" +
      (sub ? '<br><span class="sub">' + sub + "</span>" : "") + "</span>";
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () { el.remove(); }, 320);
    }, 2200);
  }

  /* -------------------------------------------------------------------
     9. Shop page: filter + search + sort
     ------------------------------------------------------------------- */
  function initShop() {
    var grid = $("[data-shop-grid]");
    if (!grid) return;

    var input = $("[data-search]");
    var wrap = $(".search");
    var clear = $("[data-search-clear]");
    var sortSel = $("[data-sort]");
    var countEl = $("[data-shop-count]");
    var empty = $("[data-shop-empty]");
    var activeCat = "all";
    var query = "";

    function countIn(catId) {
      return PRODUCTS.filter(function (p) { return catId === "all" || p.cat === catId; }).length;
    }

    function visible() {
      var list = PRODUCTS.filter(function (p) {
        if (activeCat !== "all" && p.cat !== activeCat) return false;
        if (!query) return true;
        var hay = norm(p.name + " " + p.brand + " " + p.cat + " " + (p.desc || ""));
        return query.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
      });

      var mode = sortSel ? sortSel.value : "featured";
      if (mode === "asc") list.sort(function (a, b) { return a.price - b.price; });
      else if (mode === "desc") list.sort(function (a, b) { return b.price - a.price; });
      else if (mode === "az") list.sort(function (a, b) { return a.name.localeCompare(b.name, "fr"); });
      return list;
    }

    function paint() {
      var list = visible();
      grid.innerHTML = list.map(function (p, i) {
        return productCardHTML(p, { reveal: false, delay: Math.min(i, 8) * 45 });
      }).join("");
      if (countEl) {
        var n = list.length;
        countEl.textContent = n === 0 ? "Aucun produit"
          : n + (n > 1 ? " produits" : " produit") + (activeCat === "all" ? "" : " dans cette catégorie");
      }
      if (empty) empty.style.display = n === 0 ? "block" : "none";
      grid.style.display = n === 0 ? "none" : "grid";
      // animate the freshly rendered cards
      $$(".card", grid).forEach(function (c, i) {
        c.style.animation = "riseIn .5s var(--ease-out) both";
        c.style.animationDelay = Math.min(i, 8) * 45 + "ms";
      });
    }

    // category chips
    $$("[data-chip]").forEach(function (chip) {
      var id = chip.getAttribute("data-chip");
      var c = chip.querySelector(".c");
      if (c) c.textContent = countIn(id);
      chip.addEventListener("click", function () {
        activeCat = id;
        $$("[data-chip]").forEach(function (x) { x.classList.toggle("is-on", x === chip); });
        paint();
        if (window.innerWidth < 640) chip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      });
    });

    // search
    if (input) {
      var t = null;
      input.addEventListener("input", function () {
        if (wrap) wrap.classList.toggle("has-text", !!input.value);
        clearTimeout(t);
        t = setTimeout(function () { query = norm(input.value.trim()); paint(); }, 160);
      });
    }
    if (clear && input) {
      clear.addEventListener("click", function () {
        input.value = "";
        query = "";
        if (wrap) wrap.classList.remove("has-text");
        input.focus();
        paint();
      });
    }
    if (sortSel) sortSel.addEventListener("change", paint);

    // homepage category cards deep-link into the shop
    paint();

    // honour a category chosen on the homepage
    try {
      var preset = sessionStorage.getItem("mypara.cat");
      if (preset) {
        sessionStorage.removeItem("mypara.cat");
        var chip = $('[data-chip="' + preset + '"]');
        if (chip) chip.click();
      }
    } catch (err) { /* ignore */ }
  }

  /**
   * Homepage category cards remember the choice so shop.html can open on
   * the right filter. Lives outside initShop() because the homepage has
   * no [data-shop-grid] and initShop() bails out early there.
   */
  function initDeepLinks() {
    $$("[data-goto-cat]").forEach(function (a) {
      a.addEventListener("click", function () {
        try { sessionStorage.setItem("mypara.cat", a.getAttribute("data-goto-cat")); } catch (e) { /* ignore */ }
      });
    });

    // keep hard-coded "N produits" copy honest when the catalogue grows
    $$("[data-count-label]").forEach(function (el) { el.textContent = PRODUCTS.length; });
    $$("[data-count-catalog]").forEach(function (el) { el.textContent = PRODUCTS.length; });
  }

  /* -------------------------------------------------------------------
     10. FAQ, opening hours, contact form
     ------------------------------------------------------------------- */
  function initFaq() {
    $$(".faq__q").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faq__i");
        var open = item.classList.contains("is-open");
        $$(".faq__i").forEach(function (i) {
          i.classList.remove("is-open");
          var b = i.querySelector(".faq__q");
          if (b) b.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function initHours() {
    var today = new Date().getDay();          // 0 = Sunday
    $$("[data-day]").forEach(function (row) {
      var d = parseInt(row.getAttribute("data-day"), 10);
      if (d === today) {
        row.classList.add("is-today");
        var lab = row.querySelector(".d");
        if (lab) lab.textContent = (lab.textContent.replace(/\s*\(?aujourd'hui.*$/i, "").trim()) + " · aujourd'hui";
      }
    });
  }

  function initForm() {
    var form = $("[data-form]");
    if (!form) return;
    var ok = $("[data-form-ok]");

    function setBad(field, bad) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("is-bad", bad);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;

      $$("[required]", form).forEach(function (f) {
        var v = f.type === "checkbox" ? f.checked : f.value.trim();
        var bad = f.type === "checkbox" ? !v : !v;
        setBad(f, bad);
        if (bad) { valid = false; if (!firstBad) firstBad = f; }
      });

      // email shape check
      var email = $('[type="email"]', form);
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setBad(email, true);
        valid = false;
        firstBad = firstBad || email;
      }

      if (!valid) {
        if (firstBad) firstBad.focus();
        return;
      }

      if (ok) {
        ok.classList.add("is-on");
        ok.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "center" });
        toast("Message envoyé", "Merci ! Nous répondons sur WhatsApp.");
      }
      form.reset();
      $$(".field", form).forEach(function (f) { f.classList.remove("is-bad"); });
    });

    form.addEventListener("input", function (e) {
      setBad(e.target, false);
    });
  }

  /* -------------------------------------------------------------------
     11. Category counts on the homepage
     ------------------------------------------------------------------- */
  function initCatCounts() {
    $$("[data-cat-count]").forEach(function (el) {
      var id = el.getAttribute("data-cat-count");
      var n = PRODUCTS.filter(function (p) { return p.cat === id; }).length;
      el.textContent = n + (n > 1 ? " produits" : " produit");
    });
  }

  /* -------------------------------------------------------------------
     12. Boot
     ------------------------------------------------------------------- */
  function boot() {
    initChrome();
    initMenu();
    initHero();
    initCatCounts();
    initShop();
    initDeepLinks();
    initBrands();
    initAddToCart();
    initReveal();
    initCounters();
    initRatings();
    initFaq();
    initHours();
    initForm();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
