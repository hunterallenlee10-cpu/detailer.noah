import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/site.config";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { JsonLd } from "@/components/JsonLd";
import { businessSchema } from "@/lib/schema";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["italic"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const description =
  "Mobile detailing in Harrisonburg VA by Noah's Detailing. I come to you for interior, exterior, paint correction & more. Send photos for a free quote.";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Noah's Detailing | Mobile Car Detailing in Harrisonburg, VA",
    template: "%s | Noah's Detailing",
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: "/",
    title: "Noah's Detailing | Mobile Car Detailing in Harrisonburg, VA",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Noah's Detailing | Mobile Car Detailing in Harrisonburg, VA",
    description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#07090D",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide [data-reveal] content only when JS can reveal it again. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileBar />
        </Providers>
        <JsonLd data={businessSchema()} />
      </body>
    </html>
  );
}
