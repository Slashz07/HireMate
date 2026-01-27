"use client"
import FeatureSection from "@/components/myComponents/FeatureSection";
import Figures from "@/components/myComponents/Figures";
import HeroSection from "@/components/myComponents/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <div >
      <div className="grid-background"></div>
      <HeroSection/>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <FeatureSection/>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <Figures/>
      </section>
    </div>
  );
}
