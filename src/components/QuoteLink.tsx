"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToId } from "@/lib/scroll";

/** "Get a Quote" link: smooth-scrolls to the inline form on the homepage, otherwise goes to /book. */
export function QuoteLink({ className, children, onNavigate }: { className?: string; children: React.ReactNode; onNavigate?: () => void }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  return (
    <Link
      href={onHome ? "/#quote" : "/book"}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        if (!onHome) return;
        // SmoothScroll's capture handler usually started the glide already (defaultPrevented); otherwise do it here.
        const handled = e.defaultPrevented || scrollToId("quote");
        if (handled) {
          e.preventDefault();
          history.replaceState(null, "", "#quote");
          // Hand keyboard focus to the form once the glide lands.
          setTimeout(() => document.getElementById("quote-heading")?.focus({ preventScroll: true }), 1100);
        }
      }}
    >
      {children}
    </Link>
  );
}
