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
        if (onHome && scrollToId("quote")) {
          e.preventDefault();
          history.replaceState(null, "", "#quote");
          setTimeout(() => document.getElementById("quote-heading")?.focus({ preventScroll: true }), 900);
        }
      }}
    >
      {children}
    </Link>
  );
}
