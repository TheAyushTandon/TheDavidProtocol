"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Shield, Activity } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-black border-t border-white/10 px-8 py-20 pb-40 md:px-24 z-20">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00ff88] to-emerald-500" />
            Equis
          </Link>
          <p className="text-white/40 text-sm max-w-xs mb-8 leading-relaxed">
            The next generation of financial resilience scoring. 
            Credit data beyond the traditional history.
          </p>
          <div className="flex items-center gap-6 text-white/40">
            <Box size={20} className="hover:text-white transition-colors cursor-pointer" />
            <Shield size={20} className="hover:text-white transition-colors cursor-pointer" />
            <Activity size={20} className="hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest opacity-50">Product</h4>
          <ul className="flex flex-col gap-4 text-white/40 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest opacity-50">Company</h4>
          <ul className="flex flex-col gap-4 text-white/40 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
           <h4 className="text-white font-bold text-sm mb-6 uppercase tracking-widest opacity-50">Legal</h4>
          <ul className="flex flex-col gap-4 text-white/40 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-t border-white/5 text-xs text-white/30 uppercase tracking-widest">
        <span>© {currentYear} Equis Architecture. All rights reserved.</span>
        <div className="flex gap-8">
          <span>Built for the Hackathon</span>
          <span>Powered by David Protocol</span>
        </div>
      </div>
    </footer>
  );
}
