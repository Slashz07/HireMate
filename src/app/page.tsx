"use client"
import FeatureSection from "@/components/myComponents/(LandingPageComponents)/FeatureSection";
import Figures from "@/components/myComponents/(LandingPageComponents)/Figures";
import HeroSection from "@/components/myComponents/(LandingPageComponents)/HeroSection";
import HowItWorks from "@/components/myComponents/(LandingPageComponents)/HowItWorks";
import Testimonials from "@/components/myComponents/(LandingPageComponents)/Testimonials";

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
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <Testimonials/>
      </section>
    </div>
  );
}
