"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-24 h-20 bg-black/20 backdrop-blur-md border-b border-white/10"
    >
      <Link href="/" className="text-2xl font-bold tracking-tighter text-white flex items-center gap-3">
        <img src="/logo.png" alt="Equis Logo" className="w-10 h-10 object-cover invert rounded-full" />
        <span className="font-display uppercase tracking-widest text-lg pt-1">Equis</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="/why-equis" className="hover:text-white transition-colors">Why Equis</Link>
        <Link href="#" className="hover:text-white transition-colors">Features</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="text-white hover:bg-white/10 flex">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-[#00ff88] text-black hover:bg-[#00ff88]/90 font-bold rounded-full px-6">
            Get Started
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
}
