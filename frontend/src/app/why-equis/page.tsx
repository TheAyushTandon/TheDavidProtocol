"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Shield, Zap, TrendingUp, Users } from "lucide-react";

const COMPARISON = [
  { feature: "Primary Data Source", traditional: "Past Debt History", equis: "Real-time Income & Spending", highlighted: true },
  { feature: "Update Frequency", traditional: "Monthly (Delayed)", equis: "Instantaneous", highlighted: false },
  { feature: "Bias Risk", traditional: "High (Demographic Bias)", equis: "Low (Behavioral Analysis)", highlighted: true },
  { feature: "Inclusion", traditional: "Credit-Active Only", equis: "Everyone with a Bank Account", highlighted: false },
  { feature: "Growth Incentives", traditional: "Slow Recovery", equis: "Real-time Resilience Scoring", highlighted: true },
];

const PILLARS = [
  {
    title: "Income Stability",
    description: "We look at the consistency and source of your earnings, not just the amount. Freelance, gig-work, or salary—it all counts.",
    icon: <Zap className="w-8 h-8 text-[#00ff88]" />,
  },
  {
    title: "Spending IQ",
    description: "Our AI analyzes how you manage money. Responsible spending is rewarded regardless of your credit score.",
    icon: <TrendingUp className="w-8 h-8 text-[#00ff88]" />,
  },
  {
    title: "Adaptive Risk",
    description: "Instead of one static number, Equis adapts to your current financial state, providing real-time opportunities.",
    icon: <Shield className="w-8 h-8 text-[#00ff88]" />,
  },
  {
    title: "Unified Profile",
    description: "Connected across 12,000+ banks. Access your comprehensive financial identity in seconds.",
    icon: <Users className="w-8 h-8 text-[#00ff88]" />,
  },
];

export default function WhyEquisPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00ff88] selection:text-black">
      <Navbar />

      {/* 🌌 Hero Section */}
      <section className="relative pt-40 pb-32 px-8 md:px-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00ff88]/10 blur-[180px] rounded-full -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[4.5rem] md:text-[11rem] font-display font-black leading-[0.7] mb-4 tracking-tighter"
          >
            <span className="whitespace-nowrap block -ml-[2rem] md:-ml-[8rem]" style={{ wordSpacing: '-0.2em' }}>THE SYSTEM IS</span><br/>
             <span className="text-[#00ff88] block -mt-[1.2rem] md:-mt-[9rem] -ml-[0.5rem] md:-ml-[8rem] relative z-10">OBSOLETE.</span>
          </motion.h1>
          <div className="flex justify-end">
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-3xl text-white/50 max-w-2xl font-sans font-light leading-relaxed italic text-right mt-12"
            >
              Traditional credit scores are a lagging indicator of your past. 
              Equis is a leading indicator of your future potential. 
              We built the David Protocol to bridge the gap.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ⚔️ Comparison Section */}
      <section className="py-24 px-8 md:px-24 bg-neutral-950/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-black mb-16 uppercase tracking-wider text-center">
            Traditional vs. <span className="text-[#00ff88]">Equis</span>
          </h2>
          
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10 bg-white/5">
              <div className="p-6 md:p-8 text-xs uppercase tracking-[0.2em] text-white/40">Efficiency Metrics</div>
              <div className="p-6 md:p-8 text-lg font-display text-white/60">The Old Way</div>
              <div className="p-6 md:p-8 text-lg font-display text-[#00ff88]">The Equis Way</div>
            </div>
            
            {COMPARISON.map((row, i) => (
              <div key={i} className={cn(
                "grid grid-cols-1 md:grid-cols-3 border-b border-white/5 last:border-0",
                row.highlighted && "bg-white/[0.02]"
              )}>
                <div className="p-6 md:p-8 font-sans font-medium text-white/80 border-b md:border-b-0 md:border-r border-white/5">
                  {row.feature}
                </div>
                <div className="p-6 md:p-8 text-white/30 flex items-center gap-3 border-b md:border-b-0 md:border-r border-white/5">
                   <X className="w-5 h-5 text-red-500/50 flex-shrink-0" /> 
                   <span className="text-sm md:text-base">{row.traditional}</span>
                </div>
                <div className="p-6 md:p-8 text-white font-bold flex items-center gap-3 bg-[#00ff88]/5">
                   <Check className="w-5 h-5 text-[#00ff88] flex-shrink-0" /> 
                   <span className="text-sm md:text-base">{row.equis}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 💎 Pillars Section */}
      <section className="py-24 px-8 md:px-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {PILLARS.map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6 p-4 rounded-2xl bg-[#00ff88]/5 border border-[#00ff88]/10 w-fit">
                {pillar.icon}
              </div>
              <h3 className="text-2xl font-display font-black mb-4 uppercase">{pillar.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 Final Call to Action */}
      <section className="py-24 px-8 md:px-24 mb-20">
        <div className="max-w-7xl mx-auto rounded-[3rem] p-12 md:p-24 bg-gradient-to-br from-[#00ff88]/20 to-emerald-900/10 border border-[#00ff88]/20 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-7xl font-display font-black mb-8 leading-tight">
            BE PART OF THE <br/> REVOLUTION.
          </h2>
          <p className="text-lg md:text-2xl text-white/60 mb-12 max-w-2xl font-light italic">
            Stop living in the shadow of your past debts. Start building a financial identity based on your current reality.
          </p>
          <Button 
            size="lg" 
            className="bg-[#00ff88] text-black hover:bg-[#00ff88] font-bold h-20 text-2xl rounded-full px-12 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Join Equis Today
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
