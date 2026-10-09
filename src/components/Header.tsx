"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { nav, site } from "@/site.config";
import { Logo } from "./Logo";
import { QuoteLink } from "./QuoteLink";
import { InstagramIcon } from "./icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;
  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? "border-b border-line bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-blue focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex h-[var(--header-h)] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo onClick={close} />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.href === pathname;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors hover:text-foam ${
                  active ? "text-foam" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <QuoteLink className="btn btn-primary gloss ml-3 min-h-11 px-5 text-sm">Get a Quote</QuoteLink>
        </nav>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`absolute h-0.5 w-5 rounded bg-foam transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-foam transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-foam transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border-t border-line bg-ink/95 px-4 pb-8 pt-4 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {[{ label: "Home", href: "/" }, ...nav, { label: "Harrisonburg", href: "/mobile-detailing-harrisonburg-va" }].map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} onClick={close} className="display flex min-h-14 items-center text-3xl text-foam">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <QuoteLink onNavigate={close} className="btn btn-primary flex-1">
                Get a Free Quote
              </QuoteLink>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-12 px-0" aria-label={`Instagram ${site.instagramHandle} (opens in new tab)`}>
                <InstagramIcon />
              </a>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
