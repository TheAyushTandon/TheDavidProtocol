"use client";

import { useEffect, useState, useCallback, use } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, CreditCard, ChevronRight, Loader2, CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "connecting" | "success" | "error">("loading");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      window.location.href = "/register";
      return;
    }
    setUserId(id);

    const createLinkToken = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/plaid/create_link_token?user_id=${id}`, {
          method: "POST",
        });
        const data = await response.json();
        setToken(data.link_token);
        setStatus("idle");
      } catch (err) {
        console.error("Error creating link token:", err);
        setStatus("error");
      }
    };

    createLinkToken();
  }, []);

  const onSuccess = useCallback(
    async (public_token: string, metadata: any) => {
      setStatus("connecting");
      try {
        const response = await fetch("http://127.0.0.1:8000/plaid/exchange_public_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token, user_id: parseInt(userId!) }),
        });
        
        if (response.ok) {
            setStatus("success");
            // Automatically redirect to dashboard after a delay
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);
        } else {
            setStatus("error");
        }
      } catch (err) {
        console.error("Error exchanging token:", err);
        setStatus("error");
      }
    },
    [userId]
  );

  const { open, ready } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black">
      <Navbar />
      
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
        {/* ✨ Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-2xl z-10 text-center">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-8"
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
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-[0.3em] text-[#00ff88] mb-12 shadow-inner">
                            Step 2: Financial Matrix
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black leading-tight tracking-tighter uppercase mb-6 drop-shadow-2xl">
                            Plug In Your <br />
                            <span className="text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">Account.</span>
                        </h1>
                        <p className="text-white/40 text-lg md:text-xl font-light italic mb-16 leading-relaxed max-w-lg mx-auto">
                            Link your primary bank account via Plaid to generate your 
                            <span className="text-white font-bold not-italic"> Financial Resilience Score.</span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center items-start relative px-4">
                            {[
                                { 
                                    icon: <Shield className="text-[#00ff88]" />, 
                                    title: "Secure", 
                                    desc: "Military grade",
                                    details: "AES-256 encryption. Your data is stored in an isolated vault that even we cannot access without your explicit key."
                                },
                                { 
                                    icon: <Lock className="text-[#00ff88]" />, 
                                    title: "Private", 
                                    desc: "No selling data",
                                    details: "Financial data is only used to calculate your score. We never sell, share, or monetize your information."
                                },
                                { 
                                    icon: <CreditCard className="text-[#00ff88]" />, 
                                    title: "ReadOnly", 
                                    desc: "No fund movement",
                                    details: "Equis connects as a spectator. We analyze transactions but have ZERO permission to move money."
                                },
                            ].map((item, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ 
                                        scale: 1.15,
                                        zIndex: 50,
                                        y: -20
                                    }}
                                    transition={{ 
                                        delay: 0.1 * index,
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20
                                    }}
                                    className="relative group bg-neutral-900 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-3xl hover:border-[#00ff88] transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] shadow-2xl overflow-hidden cursor-help"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#00ff88]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                                    
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="mb-6 bg-black/40 p-5 rounded-2xl border border-white/5 transform group-hover:bg-[#00ff88]/20 transition-all duration-500 shadow-xl">
                                            {item.icon}
                                        </div>
                                        
                                        <h3 className="font-black text-2xl uppercase tracking-tighter mb-2 text-white group-hover:text-[#00ff88] transition-colors">{item.title}</h3>
                                        
                                        {/* Default Mini Desc - Fades out on hover */}
                                        <p className="text-white/40 text-xs font-bold tracking-[0.3em] uppercase mb-4 transition-all duration-300 group-hover:opacity-0 group-hover:h-0">
                                            {item.desc}
                                        </p>

                                        {/* Detailed Info - Slips in on hover */}
                                        <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                                            <p className="text-white/60 text-sm font-medium leading-relaxed italic border-t border-white/5 pt-4">
                                                {item.details}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-[#00ff88]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </div>

                        <Button
                            onClick={() => open()}
                            disabled={!ready || status !== "idle"}
                            className="group relative h-28 px-16 bg-[#00ff88] text-black hover:bg-[#00ff88] text-3xl font-black rounded-[2rem] transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_20px_60px_-15px_rgba(0,255,136,0.6)] uppercase tracking-tighter"
                        >
                            <span className="flex items-center gap-4">
                                {status === "idle" ? (
                                    <>Link Bank Account <ChevronRight className="group-hover:translate-x-2 transition-transform" size={28} strokeWidth={3} /></>
                                ) : (
                                    <><Loader2 className="animate-spin" size={28} /> Synchronizing...</>
                                )}
                            </span>
                            <div className="absolute inset-x-4 -bottom-1 h-1 bg-black/20 rounded-full blur-[2px]" />
                        </Button>
                        
                        <p className="mt-10 text-white/20 text-[10px] uppercase font-bold tracking-[0.4em] flex items-center justify-center gap-3">
                            <span className="w-12 h-[1px] bg-white/10" />
                            <Lock size={12} className="opacity-50" /> Secure Plaid Tunnel
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
