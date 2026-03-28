"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, TrendingDown, ShieldCheck, 
  HelpCircle, ChevronRight, Activity, 
  Wallet, PieChart, Info, RefreshCw,
  Lock, ArrowUpRight, ArrowDownRight,
  BrainCircuit, Coins, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
       window.location.href = "/register";
       return;
    }
    setUserId(id);

    const checkAndProcess = async () => {
      try {
        // Try to get cached score
        const statusRes = await fetch(`http://127.0.0.1:8000/scoring/status/${id}`);
        if (statusRes.ok) {
           const scoreData = await statusRes.json();
           setData(scoreData);
           setLoading(false);
        } else {
           // Kick off process
           const processRes = await fetch(`http://127.0.0.1:8000/scoring/process/${id}`, {
             method: "POST"
           });
           
           if (!processRes.ok) {
             const error = await processRes.json();
             if (error.detail?.toLowerCase().includes("plaid not linked")) {
               console.log("Redirecting to onboarding because Plaid is not linked");
               window.location.href = "/onboarding";
               return;
             }
             throw new Error(error.detail || "Processing failed");
           }

           const result = await processRes.json();
           setData(result);
           setLoading(false);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    checkAndProcess();
  }, []);

  const handleManualRefresh = async () => {
    setLoading(true);
    try {
        const processRes = await fetch(`http://127.0.0.1:8000/scoring/process/${userId}`, {
            method: "POST"
        });
        const result = await processRes.json();
        setData(result);
    } catch (err) {
        console.error("Refresh error:", err);
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <DashboardLoader />;

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen">
        {/* ✨ Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-[#00ff88]/20 to-transparent border border-[#00ff88]/20 flex items-center justify-center">
                    <BrainCircuit className="text-[#00ff88]" size={24} />
                </div>
                <span className="text-white/40 uppercase tracking-[0.5em] text-[10px] font-black">Analytical Intelligence Engine</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.9]">
               Predictive <br />
               <span className="text-[#00ff88] drop-shadow-[0_0_30px_rgba(0,255,136,0.2)]">Resilience.</span>
            </h1>
          </motion.div>

          <Button 
            onClick={handleManualRefresh}
            className="group h-20 px-10 bg-white/5 border border-white/10 hover:border-[#00ff88]/40 hover:bg-[#00ff88]/10 rounded-3xl flex items-center gap-4 transition-all duration-500 backdrop-blur-xl"
          >
             <div className="flex flex-col items-end mr-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Last Analysis</span>
                <span className="text-white font-black text-sm">{new Date(data?.calculated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                <RefreshCw className="text-[#00ff88]" size={18} />
             </div>
          </Button>
        </div>

        {/* 📊 The Neural Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Primary Score Module */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-5 bg-gradient-to-b from-neutral-900/80 to-neutral-900/40 border border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center backdrop-blur-3xl relative"
            >
               <div className="absolute top-8 left-10 flex items-center gap-2">
                   <Activity className="text-[#00ff88]/40" size={16} />
                   <span className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">Live Score Matrix</span>
               </div>
               
               <div className="relative mt-8 group">
                  <div className="absolute inset-0 bg-[#00ff88]/10 blur-[80px] rounded-full group-hover:bg-[#00ff88]/20 transition-all duration-1000" />
                  <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle 
                           cx="144" cy="144" r="120" 
                           className="stroke-white/5 fill-none" strokeWidth="16" 
                        />
                        <motion.circle 
                           cx="144" cy="144" r="120" 
                           className="stroke-[#00ff88] fill-none" 
                           strokeWidth="16" 
                           strokeDasharray={120 * 2 * Math.PI}
                           initial={{ strokeDashoffset: 120 * 2 * Math.PI }}
                           animate={{ strokeDashoffset: 120 * 2 * Math.PI * (1 - (data?.score || 0) / 1000) }}
                           transition={{ duration: 2.5, ease: "circOut", delay: 0.5 }}
                           strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-8xl font-display font-black tracking-tighter"
                        >
                            {data?.score}
                        </motion.span>
                        <span className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black mt-[-4px]">Intelligence Unit</span>
                    </div>
                  </div>
               </div>
               
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className={`px-10 py-4 rounded-[2rem] border-2 text-sm font-black uppercase tracking-[0.2em] mt-12 flex items-center gap-3 backdrop-blur-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] ${
                    data?.decision === "APPROVE" ? "bg-[#00ff88]/10 border-[#00ff88]/50 text-[#00ff88]" : 
                    data?.decision === "REVIEW" ? "bg-amber-500/10 border-amber-500/50 text-amber-500" : 
                    "bg-red-500/10 border-red-500/50 text-red-500"
                  }`}
               >
                  <ShieldCheck size={20} />
                  {data?.decision} Stage Confirmed
               </motion.div>
            </motion.div>

            {/* AI Insights & Metrics */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Explainability Module */}
                <motion.div 
                   initial={{ opacity: 0, y: 40 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="md:col-span-2 bg-neutral-900/40 border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl flex flex-col relative overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00ff88]/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                            <Info className="text-[#00ff88]" size={20} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/60">Neural Decision Path</h2>
                    </div>
                    
                    <div className="relative p-10 bg-black/40 border border-white/5 rounded-[2.5rem] mb-10 border-l-[4px] border-l-[#00ff88] group hover:border-[#00ff88] transition-all duration-700">
                        <p className="text-2xl md:text-3xl font-light leading-snug italic text-white/80 tracking-tight">
                        “{data?.explanation}”
                        </p>
                        <div className="absolute top-4 right-8 text-[120px] font-serif italic text-white/[0.03] pointer-events-none group-hover:text-[#00ff88]/[0.05] transition-colors">”</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all duration-500 group cursor-pointer shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                <ArrowUpRight size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Strength Detected</p>
                                <h4 className="font-black text-lg tracking-tight">Consistent Inflow</h4>
                            </div>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-6 hover:bg-white/10 transition-all duration-500 group cursor-pointer shadow-xl">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                <Activity size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-0.5">Focus Required</p>
                                <h4 className="font-black text-lg tracking-tight">Spending Variance</h4>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Micro Metrics */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-10 bg-neutral-900/60 border border-white/5 rounded-[2.5rem] flex flex-col justify-between backdrop-blur-2xl hover:border-[#00ff88]/30 transition-colors shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <Coins className="text-[#00ff88]" size={24} />
                        <span className="text-[#00ff88] text-xs font-black tracking-widest uppercase bg-[#00ff88]/10 px-4 py-1.5 rounded-full">+12% vs LY</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Liquidity Pool</p>
                        <h4 className="text-5xl font-display font-black tracking-tighter">$12,482</h4>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-10 bg-neutral-900/60 border border-white/5 rounded-[2.5rem] flex flex-col justify-between backdrop-blur-2xl hover:border-blue-500/30 transition-colors shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-8">
                        <BarChart3 className="text-blue-500" size={24} />
                        <span className="text-blue-500 text-xs font-black tracking-widest uppercase bg-blue-500/10 px-4 py-1.5 rounded-full">Optimized</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Cash Burn Index</p>
                        <h4 className="text-5xl font-display font-black tracking-tighter">0.42</h4>
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Security Footer */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex items-center justify-center gap-8 py-10 border-t border-white/5 text-white/10 uppercase tracking-[0.6em] text-[9px] font-bold"
        >
            <div className="flex items-center gap-2"><Lock size={12}/> Encrypted Tunnel</div>
            <div className="w-2 h-2 rounded-full bg-white/5" />
            <div className="flex items-center gap-2"><ShieldCheck size={12}/> Verified AI Audit</div>
            <div className="w-2 h-2 rounded-full bg-white/5" />
            <div className="flex items-center gap-2"><Activity size={12}/> Real-time Sync</div>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}

function DashboardLoader() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-12 relative overflow-hidden">
             {/* 🌌 Cyber Background Effects */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88]/5 blur-[180px] rounded-full pointer-events-none animate-pulse" />
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent" />
             
             <div className="z-10 text-center max-w-2xl relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="mb-16 relative inline-block p-1 bg-gradient-to-br from-[#00ff88]/40 to-transparent rounded-full"
                >
                   <div className="w-40 h-40 rounded-full border-2 border-white/5 border-t-[#00ff88] animate-spin-slow border-[6px] shadow-[0_0_40px_rgba(0,255,136,0.3)] shadow-inner" />
                   <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <BrainCircuit className="text-[#00ff88]" size={48} />
                        </motion.div>
                   </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter uppercase mb-8">
                        Synthesizing <br/> <span className="text-[#00ff88] drop-shadow-[0_0_20px_rgba(0,255,136,0.4)]">Matrix DNA.</span>
                    </h2>
                    
                    <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden mb-12 mx-auto relative">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-[#00ff88] to-transparent shadow-[0_0_20px_#00ff88]"
                        />
                    </div>

                    <div className="space-y-4">
                        {[
                            "Fetching 90 days of transaction intelligence",
                            "Neutralizing financial vector space",
                            "Calibrating resilience coefficients",
                            "Applying neural classification weights"
                        ].map((text, i) => (
                            <motion.p 
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 2, duration: 1 }}
                                className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black h-4"
                            >
                                {text}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
             </div>
        </main>
    )
}
