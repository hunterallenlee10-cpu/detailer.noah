import Link from "next/link";
import { nav, site } from "@/site.config";
import { services } from "@/data/services";
import { Badge } from "./Badge";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-4">
          <div className="flex items-center gap-5">
            <Badge className="h-28 w-auto" />
            <div>
              <p className="display text-4xl text-foam">{site.tagline}</p>
              <p className="mt-2 text-sm text-muted">Mobile detailing by {site.owner}.</p>
            </div>
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm text-muted">
            <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-glow" />
            {site.serviceArea}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 text-sm md:col-span-5">
          <div>
            <p className="eyebrow mb-4">Explore</p>
            <ul className="space-y-1">
              {[{ label: "Home", href: "/" }, ...nav, { label: "Get a Quote", href: "/book" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-foam">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/mobile-detailing-harrisonburg-va" className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-foam">
                  Mobile Detailing Harrisonburg VA
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Services</p>
            <ul className="space-y-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services#${s.slug}`} className="inline-flex min-h-11 items-center text-muted transition-colors hover:text-foam">
                    {s.name.replace("Seat & Carpet Steam Cleaning & Shampooing", "Steam Clean & Shampoo")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-1 text-sm">
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-foam hover:text-blue-glow">
                <InstagramIcon className="h-4 w-4" /> {site.instagramHandle}
              </a>
            </li>
            {/* Phone / email render only once filled in site.config.ts */}
            {site.phone && (
              <li>
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-11 items-center gap-2 text-foam hover:text-blue-glow">
                  <PhoneIcon /> {site.phone}
                </a>
              </li>
            )}
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex min-h-11 items-center gap-2 text-foam hover:text-blue-glow">
                  <MailIcon /> {site.email}
                </a>
              </li>
            )}
            <li>
              <Link href="/book" className="inline-flex min-h-11 items-center gap-2 text-foam hover:text-blue-glow">
                Request a free quote →
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {year} {site.name}. {site.tagline}.
          </p>
          <p>
            Website by{" "}
            {site.credit.url ? (
              <a href={site.credit.url} className="underline-offset-4 hover:text-foam hover:underline">
                {site.credit.name}
              </a>
            ) : (
              site.credit.name
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
