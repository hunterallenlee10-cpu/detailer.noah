import Link from "next/link";
import { TruckArt } from "@/components/Badge";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(46,107,255,0.25),transparent_70%),#07090d]" />
      <div className="beads absolute inset-0 -z-10 opacity-20" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <svg viewBox="0 0 200 90" className="mx-auto w-56 text-blue-glow/60" aria-hidden="true">
          <TruckArt strokeWidth={2.5} />
        </svg>
        <p className="eyebrow mt-8">Error 404</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,6rem)] text-foam">Looks like this one needs a wash.</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back on the road.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary gloss">
            Back home <ArrowRight />
          </Link>
          <Link href="/book" className="btn btn-ghost">
            Get a free quote
          </Link>
        </div>
      </div>
    </section>
  );
}
