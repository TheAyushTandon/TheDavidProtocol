"use client";

import { BlurTextAnimation } from "@/components/ui/blur-text-animation";
import { ScrollImageSequence } from "@/components/ScrollImageSequence";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const SECTIONS = [
  {
    text: "Still getting rejected?\nNo credit history. No second chances.",
    side: "right" as const,
  },
  {
    text: "The system is broken.\nTraditional scores ignore real financial behavior.",
    side: "left" as const,
  },
  {
    text: "Meet Equis.\nCredit beyond history.",
    side: "right" as const,
  },
  {
    text: "We analyze what others miss.\nIncome stability. Spending patterns. Real life.",
    side: "left" as const,
  },
  {
    text: "Your story matters.\nNot just your past.",
    side: "right" as const,
  },
  {
    text: "Approved.\nBecause you deserve a fair chance.",
    side: "left" as const,
  },
];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main ref={containerRef} className="relative bg-black text-white selection:bg-[#00ff88] selection:text-black font-sans">
      <Navbar />
      
      {/* 🖼️ Full-Screen Background Animation (GSAP Powered) */}
      <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
        <ScrollImageSequence 
          frameCount={240} 
          baseUrl="/frames/ezgif-frame-" 
          extension=".jpg" 
        />
        <motion.div 
          style={{ 
            opacity: useTransform(smoothProgress, [0.82, 0.92], [0.4, 1]),
            backdropFilter: useTransform(smoothProgress, [0.82, 0.92], ["blur(0px)", "blur(60px)"])
          }}
          className="absolute inset-0 bg-black pointer-events-none"
        />
      </div>

      {/* 📝 Intersecting Text Sections */}
      <div className="relative z-10 w-full overflow-x-hidden">
        {SECTIONS.map((section, index) => (
          <section
            key={index}
            className={`h-screen flex items-center px-8 md:px-24 ${
              section.side === "right" ? "justify-end text-right" : "justify-start text-left"
            }`}
          >
            <BlurTextAnimation 
              text={section.text} 
              side={section.side}
              className="max-w-4xl" // Increased max-width for bigger fonts
            />
          </section>
        ))}

        {/* 🚀 Final CTA Section */}
        <section className="h-screen flex flex-col justify-center items-center px-8 z-20">
          <BlurTextAnimation 
            text={`Start your journey\nReady for financial resilience?`} 
            side="center" 
            sticky={true}
            className="mb-12 text-center"
          />
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
            <Link href="/register" className="flex-1">
              <Button 
                size="lg" 
                className="w-full group relative overflow-hidden bg-[#00ff88] text-black hover:bg-[#00ff88] font-black h-20 text-2xl rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 px-12 uppercase tracking-tighter"
              >
                <span className="relative z-10 font-display">Get Started Now</span>
              </Button>
            </Link>
            <Link href="/login" className="flex-1">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-20 border-white/20 text-white hover:bg-white/10 text-2xl rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 uppercase font-bold tracking-tighter"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </section>
      </div>

      {/* 🧪 Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#00ff88]/05 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#00ff88]/05 blur-[150px] rounded-full" />
      </div>

      <Footer />
    </main>
  );
}
