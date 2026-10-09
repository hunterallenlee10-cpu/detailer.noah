"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scrollToTarget } from "@/lib/scroll";
import { BadgeMark } from "./Badge";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display flex flex-col leading-[0.82] ${className}`}>
      <span className="text-[0.78em] tracking-wide text-foam">Noah&apos;s</span>{" "}
      <span className="text-blue-glow">Detailing</span>
    </span>
  );
}

/**
 * Header logo → top of the homepage.
 * On the homepage it glides to the very top (and clears any #section hash); elsewhere it navigates to "/",
 * which Next opens at the top.
 */
export function Logo({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-md"
      onClick={(e) => {
        onClick?.();
        if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        if (location.hash) history.replaceState(null, "", "/");
        scrollToTarget(0);
        // Drop focus from the logo so the next Tab starts from the top of the page.
        (e.currentTarget as HTMLElement).blur();
      }}
    >
      <BadgeMark className="h-10 w-auto drop-shadow-[0_4px_14px_rgba(46,107,255,0.45)]" />
      <Wordmark className="text-[1.35rem]" />
      <span className="sr-only">(home)</span>
    </Link>
  );
}
