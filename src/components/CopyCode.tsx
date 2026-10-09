"use client";

import { useState } from "react";
import { useToast } from "./Toast";
import { Check } from "./icons";

export function CopyCode({ code }: { code: string }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for older browsers / insecure contexts
      const t = document.createElement("textarea");
      t.value = code;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    toast("Code copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="group flex min-h-14 w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-blue-glow/60 bg-ink/60 px-5 transition-colors hover:border-blue-glow"
      aria-label={`Copy discount code ${code}`}
    >
      <span className="display text-4xl tracking-wider text-foam">{code}</span>
      <span className="flex items-center gap-2 text-sm font-bold text-blue-glow">
        {copied ? (
          <>
            <Check /> Copied
          </>
        ) : (
          "Copy code"
        )}
      </span>
    </button>
  );
}
