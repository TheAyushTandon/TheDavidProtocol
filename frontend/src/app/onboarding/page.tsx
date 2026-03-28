"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CreditCard, CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import BankConnection from "@/components/onboarding/BankConnection";

export default function OnboardingPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("loading");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      window.location.href = "/register";
      return;
    }
    setUserId(parseInt(id));
    setStatus("idle");
  }, []);

  const handleSuccess = () => {
    setStatus("success");
    // Automatically redirect to dashboard after a delay
    setTimeout(() => {
        window.location.href = "/dashboard";
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black">
      <Navbar />
      
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
        {/* ✨ Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-4xl z-10">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-8 text-center"
                    >
                        <div className="w-32 h-32 bg-[#00ff88]/20 rounded-full flex items-center justify-center border-4 border-[#00ff88]">
                            <CheckCircle2 size={64} className="text-[#00ff88]" />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black leading-tight uppercase tracking-tighter">
                            Linked <br/> <span className="text-[#00ff88]">Successfully.</span>
                        </h1>
                        <p className="text-white/40 text-xl font-light italic">
                            Redirecting to your dashboard to process your resilience score...
                        </p>
                        <Button
                            onClick={() => window.location.href = "/dashboard"}
                            className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 h-16 px-12 rounded-2xl text-xl font-black uppercase tracking-widest mt-8"
                        >
                            Enter Dashboard <Home className="ml-2" />
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="onboarding"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="w-full"
                    >
                        <div className="text-center mb-12">
                          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.3em] text-[#00ff88] mb-8 shadow-inner">
                              Step 2: Financial Connection
                          </div>
                          <h1 className="text-6xl md:text-7xl font-display font-black leading-tight tracking-tighter uppercase mb-6 drop-shadow-2xl">
                              Sync Your <br />
                              <span className="text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">Registry.</span>
                          </h1>
                          <p className="text-white/40 text-lg md:text-xl font-light italic mb-12 leading-relaxed max-w-lg mx-auto">
                              Connect your bank registry via phone number to generate your 
                              <span className="text-white font-bold not-italic"> Financial Resilience Score.</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                          {/* Features Column */}
                          <div className="space-y-6">
                            {[
                                { 
                                    icon: <Shield className="text-[#00ff88]" />, 
                                    title: "Secure Access", 
                                    details: "AES-256 encryption. Your registry data is processed in a secure environment and never shared."
                                },
                                { 
                                    icon: <Lock className="text-[#00ff88]" />, 
                                    title: "Compliance", 
                                    details: "Adheres to data privacy standards. We only analyze transaction metadata for scoring."
                                },
                                { 
                                    icon: <CreditCard className="text-[#00ff88]" />, 
                                    title: "Account Aggregator", 
                                    details: "Utilizing modern frameworks to safely fetch your transaction history without primary credentials."
                                },
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex gap-4 items-start"
                                >
                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 shadow-xl shrink-0">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-1">
                                      <h3 className="font-bold text-lg uppercase tracking-tight text-white">{item.title}</h3>
                                      <p className="text-white/40 text-sm italic font-light">{item.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                          </div>

                          {/* Connection Form Column */}
                          <div className="bg-neutral-900/50 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl">
                             {userId && <BankConnection userId={userId} onSuccess={handleSuccess} />}
                          </div>
                        </div>
                        
                        <p className="mt-16 text-white/20 text-[10px] uppercase font-bold tracking-[0.4em] flex items-center justify-center gap-3">
                            <span className="w-12 h-[1px] bg-white/10" />
                            <Lock size={12} className="opacity-50" /> Secure Encryption Layer
                            <span className="w-12 h-[1px] bg-white/10" />
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
