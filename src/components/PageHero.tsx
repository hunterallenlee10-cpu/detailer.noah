export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+4rem)] sm:pb-20 sm:pt-[calc(var(--header-h)+6rem)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_85%_0%,rgba(46,107,255,0.30),transparent_65%),linear-gradient(180deg,#0b1220,#07090d)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow fade-up flex items-center gap-3">
          <span className="h-px w-8 bg-blue-glow" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="display fade-up mt-5 max-w-5xl text-[clamp(3.25rem,11vw,7rem)] text-foam" style={{ animationDelay: "100ms" }}>
          {title}
        </h1>
        {intro && (
          <div className="fade-up mt-6 max-w-2xl text-lg leading-relaxed text-foam/80 sm:text-xl" style={{ animationDelay: "220ms" }}>
            {intro}
          </div>
        )}
        {children && (
          <div className="fade-up mt-8" style={{ animationDelay: "320ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
