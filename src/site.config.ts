/**
 * Every business fact lives here so the owner's details can be swapped in one place.
 * Rule: any UI tied to an empty field (phone, email, towns) hides itself. Never render "TBD" to visitors.
 */
export const site = {
  name: "Noah's Detailing",
  owner: "Noah Urquhart",
  ownerFirstName: "Noah",
  tagline: "Noble & Mobile",
  city: "Harrisonburg",
  region: "VA",
  regionName: "Virginia",
  serviceArea: "Harrisonburg, VA & surrounding areas",
  serviceTowns: [] as string[], // TODO: confirm with owner
  /** Radius of the service-area map zone (≈100-mile diameter). TODO: confirm with owner. */
  serviceRadiusMiles: 50,
  geo: { lat: 38.4496, lon: -78.8689 }, // Harrisonburg — centre of the service-area map
  phone: "", // TODO: owner's number (hide UI when empty)
  email: "", // TODO
  instagram: "https://www.instagram.com/detailer.noah/",
  instagramHandle: "@detailer.noah",
  googleForm:
    "https://docs.google.com/forms/d/e/1FAIpQLSdPR4x7gAUN4erTGe9WAbN75Ex722b8zwKataubAJweiADp-g/viewform",
  partnerDiscount: { brand: "Showcar Care", url: "https://showcarcare.com", code: "NOAH", percent: 10 },
  // From Noah's "Apparel" story highlight (prices reposted Apr 1, 2025). TODO: confirm still current + sizes in stock.
  merch: [
    { item: "Hoodie", price: 38, front: "/merch/hoodie-front.webp", back: "/merch/hoodie-back.webp", note: "Black pullover · kangaroo pocket" },
    { item: "T-Shirt", price: 26, front: "/merch/tee-front.webp", back: "/merch/tee-back.webp", note: "Black crew neck · same design" },
  ],
  domain: "https://noahsdetailing.example", // TODO real domain
  /** Only name the farm client publicly once the owner approves. */
  farmClientName: "", // TODO: e.g. "Zion's Farm of Virginia" — only with permission
  credit: { name: "Lee Systems Co.", url: "" }, // TODO: Lee Systems Co. URL if wanted
};

/** Quote form endpoint (Formspree, Resend route, n8n webhook…). Empty = spec/demo mode. */
export const quoteEndpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

export const nav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
] as const;
