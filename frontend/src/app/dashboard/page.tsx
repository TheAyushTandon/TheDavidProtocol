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
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const statusRes = await fetch(`${baseUrl}/scoring/status/${id}`);
        if (statusRes.ok) {
           const scoreData = await statusRes.json();
           setData(scoreData);
           setLoading(false);
        } else {
           const processRes = await fetch(`${baseUrl}/scoring/process/${id}`, {
             method: "POST"
           });
           
           if (!processRes.ok) {
             const error = await processRes.json();
             if (error.detail?.toLowerCase().includes("phone number not linked")) {
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

  if (loading) return <DashboardLoader />;

  // Map 300-850 to 0-100 percentage for the gauge
  const progressPercentage = ((data?.score - 300) / (850 - 300)) * 100;

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-[#00ff88] selection:text-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen">
        {/* ✨ Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center">
                    <BrainCircuit className="text-[#00ff88]" size={20} />
                </div>
                <span className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-black">Equis Scoring Engine v2.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]">
               Credit <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-[#00ff88] drop-shadow-[0_0_30px_rgba(255,165,0,0.1)]">Resilience.</span>
            </h1>
          </motion.div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Financial Identity</p>
                <p className="text-2xl font-black text-white">{data?.user?.full_name}</p>
                <p className="text-white/40 text-sm font-light italic">{data?.user?.phone_number || "XXXXXXXXXX"}</p>
            </div>
          </div>
        </div>

        {/* 📊 The Analytical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Primary Score Dial/Gauge */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="lg:col-span-6 bg-neutral-900/40 border border-white/5 rounded-[3.5rem] p-12 flex flex-col items-center justify-center backdrop-blur-3xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-[#00ff88]" />
               
               <div className="flex items-center gap-2 mb-12">
                   <Activity className="text-white/20" size={16} />
                   <span className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black">Live Pulse Score</span>
               </div>
               
               <div className="relative group mb-8">
                  <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* Background Progress Circle */}
                    <svg className="w-full h-full transform -rotate-[220deg]">
                        <circle 
                           cx="160" cy="160" r="140" 
                           className="stroke-white/5 fill-none" strokeWidth="20" 
                           strokeDasharray="615"
                           strokeDashoffset="120"
                           strokeLinecap="round"
                        />
                        {/* Gradient Score Arc */}
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                        <motion.circle 
                           cx="160" cy="160" r="140" 
                           className="fill-none" 
                           stroke="url(#scoreGradient)"
                           strokeWidth="24" 
                           strokeDasharray="615"
                           initial={{ strokeDashoffset: 615 }}
                           animate={{ strokeDashoffset: 615 - (495 * ((data?.score || 0) / 1000)) }}
                           transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                           strokeLinecap="round"
                        />
                    </svg>
                    
                    <div className="absolute flex flex-col items-center">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-9xl font-display font-black tracking-tighter"
                        >
                            {data?.score}
                        </motion.span>
                        <div className="flex gap-4 text-white/20 uppercase tracking-widest text-[9px] font-black mt-[-4px]">
                            <span>0 Baseline</span>
                            <span className="text-white/40">|</span>
                            <span>1000 Peak</span>
                        </div>
                    </div>
                  </div>
               </div>
               
               <p className="text-white/40 text-center max-w-sm text-sm font-light leading-relaxed px-4">
                  “{data?.explanation}”
               </p>
            </motion.div>

            {/* Metrics & Tips */}
            <div className="lg:col-span-6 flex flex-col gap-8">
                {/* Cash Flow Summary */}
                <div className="grid grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 bg-neutral-900 border border-white/5 rounded-[2.5rem] backdrop-blur-xl group hover:border-[#00ff88]/30 transition-all"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <ArrowUpRight className="text-[#00ff88]" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Inflow</span>
                        </div>
                        <h4 className="text-4xl font-display font-black text-white group-hover:text-[#00ff88] transition-colors tracking-tighter">
                            ₹{(data?.total_inflow || 0).toLocaleString()}
                        </h4>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-10 bg-neutral-900 border border-white/5 rounded-[2.5rem] backdrop-blur-xl group hover:border-red-500/30 transition-all"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <ArrowDownRight className="text-red-500" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total Outflow</span>
                        </div>
                        <h4 className="text-4xl font-display font-black text-white group-hover:text-red-500 transition-colors tracking-tighter">
                            ₹{(data?.total_outflow || 0).toLocaleString()}
                        </h4>
                    </motion.div>
                </div>

                {/* AI Insights by Gemini */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 bg-gradient-to-br from-neutral-900 to-black border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-[#00ff88]/10 flex items-center justify-center text-[#00ff88] border border-[#00ff88]/20">
                            <BrainCircuit size={24} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase tracking-[0.2em] text-sm">Resilience Strategy</h3>
                            <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold">Optimized by Gemini Large Model</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(data?.tips || []).map((tip: string, i: number) => (
                            <div key={i} className="flex gap-5 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                                <div className="mt-1 w-2 h-2 rounded-full bg-[#00ff88] shrink-0 group-hover:scale-150 transition-transform" />
                                <p className="text-white/60 text-sm leading-relaxed font-light">{tip}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>

        {/* Neural Map / Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
             {[
                { 
                    label: "Stability Index", 
                    value: data?.stability_index || "A+", 
                    icon: <ShieldCheck size={18}/>, 
                    color: "text-blue-400" 
                },
                { 
                    label: "Burn Velocity", 
                    value: data?.burn_velocity || "0.42x", 
                    icon: <Coins size={18}/>, 
                    color: "text-purple-400" 
                },
                { 
                    label: "Account Status", 
                    value: data?.account_status || "VERIFIED", 
                    icon: <Lock size={18}/>, 
                    color: (data?.account_status?.toLowerCase() === 'at risk' || data?.account_status?.toLowerCase() === 'reject') ? "text-red-400" : "text-emerald-400" 
                }
             ].map((stat, i) => (
                <div key={i} className="p-8 bg-neutral-900/40 border border-white/5 rounded-3xl flex items-center justify-between shadow-xl">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                        <h5 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h5>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-white/20">
                        {stat.icon}
                    </div>
                </div>
             ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function DashboardLoader() {
    return (
        <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-12 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00ff88]/5 blur-[180px] rounded-full pointer-events-none animate-pulse" />
             <div className="z-10 text-center max-w-2xl">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="mb-12 relative inline-block p-1 bg-gradient-to-br from-[#00ff88]/40 to-transparent rounded-full"
                >
                   <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-[#00ff88] animate-spin shadow-[0_0_40px_rgba(0,255,136,0.3)]" />
                   <div className="absolute inset-0 flex items-center justify-center">
                        <BrainCircuit className="text-[#00ff88]" size={36} />
                   </div>
                </motion.div>
                <h2 className="text-4xl font-display font-black tracking-tighter uppercase mb-4">
                    Decoding <span className="text-[#00ff88]">Financial Pulse.</span>
                </h2>
                <p className="text-white/20 uppercase tracking-[0.4em] text-[10px] font-black italic">Running Neural Inference...</p>
             </div>
        </main>
    )
}
