"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    age: "",
    gender: "",
    password: ""
  });
  const [otp, setOtp] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age)
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
      }

      const user = await response.json();
      localStorage.setItem("user_id", user.id.toString());
      console.log("Registration successful, moving to OTP stage");
      setStage("otp");
    } catch (err: any) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          code: otp
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Invalid OTP");
      }

      console.log("OTP Verified!");
      window.location.href = "/onboarding";
    } catch (err: any) {
      alert(err.message);
      console.error(err);
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
              {stage === "form" ? "Start Your" : "Verify Your"} <br/> 
              <span className="text-[#00ff88]">{stage === "form" ? "Journey." : "Identity."}</span>
            </h1>
            <p className="text-white/40 text-lg md:text-xl font-light italic">
              {stage === "form" 
                ? "Create your account and unlock your financial resilience."
                : `We've sent a 6-digit code to ${formData.email || 'your email'}.`
              }
            </p>
          </motion.div>

          <motion.div
            key={stage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            {stage === "form" ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00ff88] transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-[#00ff88]/50 transition-all placeholder:text-white/10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00ff88] transition-colors" size={20} />
                    <input 
                      type="email" 
                      placeholder="name@example.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-[#00ff88]/50 transition-all placeholder:text-white/10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Age</label>
                    <input 
                      type="number" 
                      placeholder="25" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white focus:outline-none focus:border-[#00ff88]/50 transition-all placeholder:text-white/10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 px-6 text-white/60 focus:outline-none focus:border-[#00ff88]/50 transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select</option>
                      <option value="male" className="bg-black text-white">Male</option>
                      <option value="female" className="bg-black text-white">Female</option>
                      <option value="other" className="bg-black text-white">Other</option>
                      <option value="n/a" className="bg-black text-white">N/A</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00ff88] transition-colors" size={20} />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                  {loading ? "Processing..." : <div className="flex items-center gap-2">Send Verification <ArrowRight size={20} /></div>}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold block text-center">6-Digit Security Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-black/60 border-2 border-[#00ff88]/20 rounded-3xl py-8 text-center text-4xl font-display font-black tracking-[0.5em] text-[#00ff88] focus:outline-none focus:border-[#00ff88] transition-all placeholder:text-white/5"
                    required
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-[#00ff88] text-black hover:bg-[#00ff88] font-black h-20 text-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 uppercase tracking-tighter"
                >
                  {loading ? "Verifying..." : "Validate Profile"}
                </Button>
                
                <button 
                  type="button"
                  onClick={() => setStage("form")}
                  className="w-full text-white/20 text-xs uppercase tracking-widest hover:text-white transition-colors"
                >
                  Incorrect details? Go back
                </button>
              </form>
            )}

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-sm">
              <p className="text-white/40">
                Already have an account?{" "}
                <Link href="/login" className="text-[#00ff88] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
              <div className="flex items-center gap-2 text-white/20 text-xs uppercase tracking-[0.2em] mt-2">
                <ShieldCheck size={14} /> Encrypted & Secure
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
