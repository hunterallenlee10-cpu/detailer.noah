import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ServicesGrid } from "@/components/ServicesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { Proof } from "@/components/Proof";
import { MoreThanCars } from "@/components/MoreThanCars";
import { QuoteSection } from "@/components/QuoteSection";
import { MeetNoah } from "@/components/MeetNoah";
import { ShopMerch } from "@/components/ShopMerch";
import { ServiceArea } from "@/components/ServiceArea";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { faqSchema } from "@/lib/schema";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <BeforeAfter />
      <ServicesGrid />
      <HowItWorks />
      <Proof />
      <MoreThanCars />
      <QuoteSection />
      <MeetNoah />
      <ShopMerch />
      <ServiceArea />
      <Faq />
      <FinalCta />
      <JsonLd data={faqSchema()} />
    </>
  );
}
