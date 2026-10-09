import { reviews } from "@/data/reviews";

// Add real Google reviews here once the Google Business Profile is live. Never fabricate.
export function Reviews() {
  if (!reviews.length) return null;
  return (
    <div className="mt-16">
      <h3 className="eyebrow">Google reviews</h3>
      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <li key={r.author + r.date} className="rounded-2xl border border-line bg-panel p-6">
            <blockquote className="leading-relaxed text-foam/90">“{r.text}”</blockquote>
            <p className="mt-4 text-sm text-muted">
              {r.author} · {r.source}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
