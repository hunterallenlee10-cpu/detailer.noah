import { site } from "@/site.config";
import { services } from "@/data/services";
import { faq } from "@/data/faq";

/** AutoWash (a LocalBusiness subtype). No aggregateRating (no real reviews), no priceRange (unknown). */
export function businessSchema() {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AutoWash",
    "@id": `${site.domain}/#business`,
    name: site.name,
    slogan: site.tagline,
    description: `Mobile car detailing in ${site.city}, ${site.region}. ${site.ownerFirstName} comes to you — exterior and interior washes, paint correction and wax, steam cleaning and shampoo, pet hair removal, headlight restoration and engine bay detailing.`,
    url: site.domain,
    image: `${site.domain}/opengraph-image`,
    logo: `${site.domain}/brand/badge.svg`,
    founder: { "@type": "Person", name: site.owner },
    areaServed: [
      {
        "@type": "City",
        name: site.city,
        containedInPlace: { "@type": "State", name: site.regionName },
      },
      ...site.serviceTowns.map((t) => ({ "@type": "City", name: t })),
    ],
    sameAs: [site.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Detailing services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.short, url: `${site.domain}/services#${s.slug}` },
      })),
    },
  };
  // Only emit contact fields when the owner has filled them in.
  if (site.phone) data.telephone = site.phone;
  if (site.email) data.email = site.email;
  return data;
}

export function faqSchema(items = faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.domain },
      { "@type": "ListItem", position: 2, name, item: `${site.domain}${path}` },
    ],
  };
}
