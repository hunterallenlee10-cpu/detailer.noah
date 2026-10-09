export type Review = { author: string; text: string; source: "Google"; date: string; url?: string };

// Add real Google reviews here once the Google Business Profile is live. Never fabricate.
export const reviews: Review[] = [];
