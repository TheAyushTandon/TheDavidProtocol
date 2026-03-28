"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Login failed");
      }

      const user = await response.json();
      localStorage.setItem("user_id", user.id.toString());
      
      // Redirect based on whether they have plaid token
      // For now, simpler: redirect to dashboard, dashboard will check status
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#00ff88] selection:text-black font-sans">
      <Navbar />

      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">
        {/* ✨ Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff88]/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-xl z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-7xl font-display font-black leading-tight mb-4 tracking-tighter uppercase">
              Welcome <br/> <span className="text-[#00ff88]">Back.</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl font-light italic">
              Continue your journey to financial resilience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00ff88] transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-[#00ff88]/50 transition-all placeholder:text-white/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Password</label>
                  <Link href="#" className="text-xs text-white/20 hover:text-[#00ff88] transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00ff88] transition-colors" size={20} />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-[#00ff88]/50 transition-all placeholder:text-white/10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88] font-black h-20 text-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 uppercase tracking-tighter mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign In <ArrowRight size={20} />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-sm">
              <p className="text-white/40">
                Don't have an account yet?{" "}
                <Link href="/register" className="text-[#00ff88] font-bold hover:underline">
                  Join Equis Now
                </Link>
              </p>
              <div className="flex items-center gap-2 text-white/20 text-xs uppercase tracking-[0.2em] mt-2">
                <KeyRound size={14} /> 256-bit AES Encryption
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
