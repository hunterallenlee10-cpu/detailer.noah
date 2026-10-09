"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/site.config";
import { QuoteLink } from "./QuoteLink";
import { InstagramIcon } from "./icons";

/** Sticky bottom CTA on phones. Body has matching bottom padding so it never covers content. */
export function MobileBar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = document.getElementById("quote");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => {
      io.disconnect();
      setHidden(false);
    };
  }, [pathname]);

  if (pathname === "/book") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/90 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : ""
      }`}
      inert={hidden}
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
    >
      <div className="flex gap-3">
        <QuoteLink className="btn btn-primary gloss flex-1">Get a Free Quote</QuoteLink>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost w-12 shrink-0 px-0"
          aria-label={`DM me on Instagram ${site.instagramHandle} (opens in new tab)`}
        >
          <InstagramIcon />
        </a>
      </div>
    </div>
  );
}
