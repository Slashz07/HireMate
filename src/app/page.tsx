"use client"
import FeatureSection from "@/components/myComponents/FeatureSection";
import Figures from "@/components/myComponents/Figures";
import HeroSection from "@/components/myComponents/HeroSection";
import HowItWorks from "@/components/myComponents/HowItWorks";

export default function Home() {
  return (
    <div >
      <div className="grid-background"></div>
      <section className='w-full pt-36 md:pt-48 pb-10 '>
        <HeroSection />
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <FeatureSection />
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <Figures />
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <HowItWorks/>
      </section>
    </div>
  );
}
