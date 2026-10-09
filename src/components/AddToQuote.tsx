"use client";

import Link from "next/link";
import { quoteStore, useQuoteServices } from "@/lib/quote-store";
import { scrollToId } from "@/lib/scroll";
import { useToast } from "./Toast";
import { Check, Plus } from "./icons";

/** "Add to quote": on the homepage pre-checks the service and scrolls to the form; elsewhere links to /book. */
export function AddToQuote({ name, slug, mode = "scroll", className = "" }: { name: string; slug: string; mode?: "scroll" | "link"; className?: string }) {
  const selected = useQuoteServices();
  const toast = useToast();
  const added = selected.includes(name);
  const base = `inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-bold transition-colors ${className}`;

  if (mode === "link") {
    return (
      <Link href={`/book?service=${slug}`} className={base}>
        <Plus /> Add to quote<span className="sr-only">for {name}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={base}
      onClick={() => {
        quoteStore.add(name);
        if (!added) toast(`${name} added to your quote`);
        setTimeout(() => {
          scrollToId("quote");
          setTimeout(() => document.getElementById("quote-heading")?.focus({ preventScroll: true }), 1300);
        }, 250);
      }}
    >
      {added ? <Check /> : <Plus />} {added ? "Added — view quote" : "Add to quote"}
      <span className="sr-only">for {name}</span>
    </button>
  );
}
