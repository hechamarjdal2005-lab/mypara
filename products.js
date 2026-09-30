/* =====================================================================
   MY PARA — product catalogue
   products.js
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to update the shop.

   Each product:
     id       unique string, used by the cart (never change it once
              products are in a customer's saved cart)
     name     display name
     brand    manufacturer
     price    current price in MAD (DH)
     was      previous price (optional) -> renders strikethrough + "-x%"
     cat      category id, must match a key in CATEGORIES
     ml       size / format, optional
     badge    "promo" | "advice" | "new" | "top" | false
     image    image URL. Leave as "" to use the built-in SVG placeholder
              (a soft gradient tile with a product silhouette + the brand
              monogram). Paste a real photo URL here to override, e.g.
              image: "https://images.unsplash.com/photo-xxxx?w=600&q=80"
     shape    placeholder silhouette: drop | tube | jar | pump |
              capsule | box | spray
     tint     placeholder gradient: mint | coral | peach | sky | lilac
              | cream
     desc     short description, used on cards and in the WhatsApp order
   ===================================================================== */

/* ---------------------------------------------------------------------
   Categories
   ------------------------------------------------------------------ */
const CATEGORIES = [
  { id: "visage",     name: "Soins Visage & Solaire", short: "Visage & Solaire", icon: "sun",     tint: "#ffe0d7" },
  { id: "cheveux",   name: "Cheveux & Anti-chute",  short: "Cheveux",         icon: "leaf",    tint: "#c6e3d4" },
  { id: "complements",name: "Compléments Alimentaires",short: "Compléments",     icon: "pill",    tint: "#e2eef5" },
  { id: "corps",      name: "Soins Corps",            short: "Corps",           icon: "droplet", tint: "#ece7f5" },
  { id: "bebe",       name: "Maman & Bébé",           short: "Bébé",            icon: "heart",   tint: "#fbe7dd" }
];

/* ---------------------------------------------------------------------
   Products
   ------------------------------------------------------------------ */
const PRODUCTS = [
  /* ---------------- Soins Visage & Solaire ---------------- */
  {
    id: "lrp-anthelios-uvmune",
    name: "Anthelios UVMune 400 Fluid Invisible SPF50+",
    brand: "La Roche-Posay",
    price: 385, was: 430,
    cat: "visage", ml: "50 ml",
    badge: "advice",
    shape: "tube", tint: "sky",
    desc: "Protection solaire invisible, très haute protection UVA/UVB, sans trace blanche."
  },
  {
    id: "eucerin-aquaporin-50",
    name: "Aquaporin Active 50+ Crème Hydratante SPF50+",
    brand: "Eucerin",
    price: 289, was: 340,
    cat: "visage", ml: "50 ml",
    badge: "promo",
    shape: "jar", tint: "mint",
    desc: "Crème de jour anti-âge, hydrate 48h et réduit visiblement les rides."
  },
  {
    id: "isdin-fotoprotector-spray",
    name: "Fotoprotector Fluid Invisible SPF50+ Spray",
    brand: "Isdin",
    price: 420, was: 495,
    cat: "visage", ml: "200 ml",
    badge: "promo",
    shape: "spray", tint: "coral",
    desc: "Spray solaire invisible, laqué léger, la texture favorite de notre pharmacienne."
  },
  {
    id: "cerave-creme-lavante",
    name: "Crème Lavante Hydratante Visage & Corps",
    brand: "CeraVe",
    price: 245,
    cat: "visage", ml: "473 ml",
    badge: "top",
    shape: "pump", tint: "mint",
    desc: "Nettoie sans dessécher grâce aux 3 céramides et à l'acide hyaluronique."
  },
  {
    id: "eucerin-anti-pigment-dual",
    name: "Anti-Pigment Dual Serum Sérum Anti-Taches",
    brand: "Eucerin",
    price: 520,
    cat: "visage", ml: "30 ml",
    badge: "advice",
    shape: "drop", tint: "peach",
    desc: "Sérum ciblé taches brunes et post-inflammatoires, action éclaircissante douce."
  },
  {
    id: "biafine-baume-reparateur",
    name: "Baume Réparateur Jambes & Mains",
    brand: "Biafine",
    price: 175,
    cat: "visage", ml: "186 ml",
    badge: false,
    shape: "tube", tint: "cream",
    desc: "Répare les peaux sèches, gerçures et marques. Référence de parapharmacie."
  },
  {
    id: "lrp-effaclar-duo",
    name: "Effaclar Duo+ Sérum Correcteur Imperfections",
    brand: "La Roche-Posay",
    price: 340,
    cat: "visage", ml: "40 ml",
    badge: "top",
    shape: "drop", tint: "sky",
    desc: "Anti-imperfections, anti-marques, pores resserrés. Pour peaux mixtes à grasses."
  },
  {
    id: "cerave-serum-acide-hyaluronique",
    name: "Sérum Acide Hyaluronique + Vitamine B5",
    brand: "CeraVe",
    price: 265,
    cat: "visage", ml: "30 ml",
    badge: false,
    shape: "drop", tint: "mint",
    desc: "Sérum hydratant 24h, texture fluide, à superposer sous la crème."
  },

  /* ---------------- Cheveux & Anti-chute ---------------- */
  {
    id: "perfectil-densite",
    name: "Perfectil Densité Anti-Chute 90 Capsules",
    brand: "Perfectil",
    price: 449, was: 520,
    cat: "cheveux", ml: "90 capsules",
    badge: "promo",
    shape: "capsule", tint: "cream",
    desc: "Vitamines, minéraux et acides aminés pour freiner la chute des cheveux."
  },
  {
    id: "neoxidil-serum",
    name: "Neoxidil Sérum Capillaire Anti-Chute 5%",
    brand: "Galderma",
    price: 890,
    cat: "cheveux", ml: "60 ml",
    badge: "advice",
    shape: "drop", tint: "peach",
    desc: "Traitement dermocosmétique de référence contre l'alopécie androgénétique."
  },
  {
    id: "eucerin-dermocapillaire",
    name: "DermoCapillaire Shampooing Antipelliculaire",
    brand: "Eucerin",
    price: 240,
    cat: "cheveux", ml: "200 ml",
    badge: false,
    shape: "pump", tint: "mint",
    desc: "Shampooing clinique antipelliculaire, à l'acide salicylique."
  },
  {
    id: "lrp-kerium-shampooing",
    name: "Kerium Shampooing Apaisant Cuirs Chevelus Sensibles",
    brand: "La Roche-Posay",
    price: 195,
    cat: "cheveux", ml: "200 ml",
    badge: "advice",
    shape: "pump", tint: "sky",
    desc: "Formulé pour les cuirs chevelu réactifs, sans sulfate agressif."
  },

  /* ---------------- Compléments Alimentaires ---------------- */
  {
    id: "uvedose-vitamine-d3",
    name: "Vitamine D3 Uvedose 20 000 UI",
    brand: "Uvedose",
    price: 130,
    cat: "complements", ml: "2 ampoules",
    badge: "top",
    shape: "capsule", tint: "sky",
    desc: "Vitamine D3 en ampoule, absorption optimale. Idéal en hiver au Maroc."
  },
  {
    id: "omacor-omega3",
    name: "Oméga-3 Omacor 60 Gélules",
    brand: "Omacor",
    price: 235,
    cat: "complements", ml: "60 gélules",
    badge: false,
    shape: "capsule", tint: "mint",
    desc: "Purification d'huile de poisson, cholestérol et fonction cardiaque."
  },
  {
    id: "mag-b6-sandoz",
    name: "Magnésium + Vitamine B6 50 Comprimés",
    brand: "Sandoz",
    price: 95,
    cat: "complements", ml: "50 comprimés",
    badge: "top",
    shape: "box", tint: "lilac",
    desc: "Fatigue, stress, crampes : le duo magnésium-vitamine B6."
  },
  {
    id: "fer-vitc",
    name: "Fer + Vitamine C 30 Comprimés",
    brand: "Sandoz",
    price: 105,
    cat: "complements", ml: "30 comprimés",
    badge: false,
    shape: "box", tint: "peach",
    desc: "Contre la carence martiale, meilleure absorption grâce à la vitamine C."
  },

  /* ---------------- Soins Corps ---------------- */
  {
    id: "eucerin-ph5-lotion",
    name: "pH5Body Lotion Lavante Corps 5% pH",
    brand: "Eucerin",
    price: 265,
    cat: "corps", ml: "1000 ml",
    badge: "top",
    shape: "pump", tint: "mint",
    desc: "Le grand format pour toute la famille, respecte le pH de la peau."
  },
  {
    id: "lrp-lipikar-syndet",
    name: "Lipikar Syndet AP+ Bain Apaisant Extrême Sèche",
    brand: "La Roche-Posay",
    price: 320,
    cat: "corps", ml: "400 ml",
    badge: "advice",
    shape: "pump", tint: "coral",
    desc: "Syndet physiologique pour peaux très sèches, apaise les démangeaisons."
  },
  {
    id: "eucerin-urearepair",
    name: "UreaRepair Plus Lait Corps 10% Urée",
    brand: "Eucerin",
    price: 330,
    cat: "corps", ml: "400 ml",
    badge: false,
    shape: "pump", tint: "cream",
    desc: "Peaux très sèches et rugueuses : 48h d'hydratation intense."
  },
  {
    id: "biafine-spray-jambes",
    name: "Biafine Emulsion Rafraîchissante Jambes Lourdes",
    brand: "Biafine",
    price: 145,
    cat: "corps", ml: "186 ml",
    badge: false,
    shape: "spray", tint: "mint",
    desc: "Effet fraîcheur immédiat pour les jambes lourdes en fin de journée."
  },

  /* ---------------- Maman & Bébé ---------------- */
  {
    id: "cerave-bebe-baume",
    name: "Baume Lavant Bébé & Nourrissons",
    brand: "CeraVe",
    price: 185,
    cat: "bebe", ml: "236 ml",
    badge: "advice",
    shape: "pump", tint: "coral",
    desc: "Sans parfum, sans savon, respects le pH de la peau des bébés."
  },
  {
    id: "mustela-stelatopia",
    name: "Stelatopia Crème Visage Bébé & Bébé Rose",
    brand: "Mustela",
    price: 210,
    cat: "bebe", ml: "40 ml",
    badge: "top",
    shape: "tube", tint: "peach",
    desc: "Apaise les rougeurs du visage et les peaux sujettes aux érythèmes."
  },
  {
    id: "svr-bebe-solaire",
    name: "Sun Secure Bébé Lait Solaire SPF50+",
    brand: "SVR",
    price: 280,
    cat: "bebe", ml: "400 ml",
    badge: "advice",
    shape: "tube", tint: "cream",
    desc: "Protection solaire large spectre SPF50+, sans oxyde de zinc, sans parfum."
  },
  {
    id: "mustela-mustela-gel",
    name: "Mustela Gel Nettoyant Bébé Sans Rinçage",
    brand: "Mustela",
    price: 145,
    cat: "bebe", ml: "300 ml",
    badge: false,
    shape: "pump", tint: "lilac",
    desc: "Daily gel lavant très doux, ne nécessite pas de rinçage."
  }
];

/* ---------------------------------------------------------------------
   Store settings — WhatsApp, promo thresholds
   ------------------------------------------------------------------ */
const SHOP = {
  whatsappNumber: "212661067621",   // international format, no "+"
  displayPhone: "06 61 06 76 21",
  freeShippingFrom: 400,            // DH — shows the "livraison offerte" meter
  currency: "DH",
  shopName: "My Para — Parapharmacie Béni Mellal"
};

/* ---------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */

/**
 * Format a number as Moroccan dirams, e.g. 289 -> "289 DH".
 * The group separator is forced to a non-breaking space: fr-MA renders
 * 1348 as "1.348", which a customer reads as one dirham and 348 centimes.
 * Dirhams have no decimals, so a space is the only unambiguous choice.
 */
function formatPrice(n) {
  var parts = new Intl.NumberFormat("fr-MA", { maximumFractionDigits: 0 })
    .formatToParts(Math.round(n));
  var out = "";
  for (var i = 0; i < parts.length; i++) {
    out += parts[i].type === "group" ? "\u00a0" : parts[i].value;
  }
  return out + "\u00a0" + SHOP.currency;
}

/** Look up a product by id */
function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

/** Category meta by id */
function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || null;
}

/** Percentage saved, or 0 when there is no former price */
function discountOf(p) {
  return p.was && p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
}

/** Products flagged as "best sellers" for the homepage */
function featuredProducts(limit) {
  const order = ["lrp-anthelios-uvmune", "perfectil-densite", "eucerin-aquaporin-50", "cerave-creme-lavante", "isdin-fotoprotector-spray", "neoxidil-serum"];
  const picked = order.map(getProduct).filter(Boolean);
  return typeof limit === "number" ? picked.slice(0, limit) : picked;
}

/** Three tiles for the hero shelf */
function shelfProducts() {
  return ["eucerin-aquaporin-50", "lrp-anthelios-uvmune", "perfectil-densite"].map(getProduct).filter(Boolean);
}

/* ---------------------------------------------------------------------
   Product placeholder artwork
   A soft gradient tile with a line-art silhouette of the packaging.
   Silhouettes are pure SVG so they stay crisp at any size, never 404,
   and match the site's rounded, mint-tinted icon language.
   To use a real photo instead, set the product's `image` to a URL.
   ------------------------------------------------------------------ */
const SHAPES = {
  drop: `<path d="M16 3c0 4.5-6 7.5-6 13a6 6 0 0 0 12 0c0-5.5-6-8.5-6-13Z"/><path d="M13.2 17.2a2.9 2.9 0 0 0 2.6 3"/><path d="M13 6.5 8 3"/><rect x="6.4" y="1.6" width="2.2" height="4.6" rx="1.1"/>`,
  tube: `<path d="M8.5 4.5h7a1.5 1.5 0 0 1 1.5 1.5v13.2A3.3 3.3 0 0 1 13.7 22.5h-3.4A3.3 3.3 0 0 1 7 19.2V6a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8 4.5V3h8v1.5"/><path d="M9.6 15.5h4.8"/><path d="M9.6 18h4.8"/>`,
  jar: `<path d="M6.5 8.5h11a2 2 0 0 1 2 2v6.8A2.2 2.2 0 0 1 17.3 19.5H6.7a2.2 2.2 0 0 1-2.2-2.2V10.5a2 2 0 0 1 2-2Z"/><rect x="5.2" y="5" width="13.6" height="3.5" rx="1.4"/><path d="M9.5 13.2h5"/>`,
  pump: `<rect x="7.5" y="7" width="9" height="15" rx="2.2"/><path d="M9.5 7V5.4A1.4 1.4 0 0 1 10.9 4h3.4"/><path d="M14 4h2.6a1 1 0 0 1 1 1v1.4"/><path d="M9.8 12.5h4.4M9.8 16h4.4"/>`,
  capsule: `<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M12 8v8"/><path d="M3 12a4 4 0 0 1 4-4h5v8H7a4 4 0 0 1-4-4Z" fill="currentColor" fill-opacity=".18" stroke="none"/>`,
  box: `<path d="M4.5 7.2 12 3.5l7.5 3.7v9.6L12 20.5l-7.5-3.7Z"/><path d="M4.5 7.2 12 11l7.5-3.8M12 11v9.5"/><path d="m8.3 5.4 7.5 3.7"/>`,
  spray: `<rect x="8" y="9" width="8" height="13" rx="2"/><path d="M10 9V7.2A1.2 1.2 0 0 1 11.2 6h1.6A1.2 1.2 0 0 1 14 7.2V9"/><path d="M12 6V3.4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V6"/><path d="M18 3h1.8"/><path d="M9.8 13.5h4.4M9.8 17h4.4"/>`
};

/** Inline SVG markup for a product's placeholder / silhouette. */
function productArt(p) {
  const shape = SHAPES[p.shape] || SHAPES.jar;
  return (
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shape}</svg>`
  );
}
