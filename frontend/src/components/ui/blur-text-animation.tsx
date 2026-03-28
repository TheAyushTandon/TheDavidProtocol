"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BlurTextAnimationProps {
  text: string;
  className?: string;
  side?: "left" | "right" | "center";
  sticky?: boolean;
}

export function BlurTextAnimation({ text, className, side = "left", sticky = false }: BlurTextAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacityRange = sticky ? [0.2, 0.4, 1, 1] : [0.2, 0.4, 0.6, 0.8];
  const xRange = sticky ? [0.2, 0.4, 1, 1] : [0.2, 0.4, 0.6, 0.8];
  
  const opacity = useTransform(scrollYProgress, opacityRange, [0, 1, 1, 0]);
  const initialX = side === "right" ? 100 : -100;
  const x = useTransform(scrollYProgress, xRange, [initialX, 0, 0, initialX]);

  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  const lines = text.split("\n");

  // ✨ HELPER: Determine the styling for a specific word based on the content
  const getWordStyle = (word: string, lineIdx: number) => {
    const cleanWord = word.toLowerCase().replace(/[?.,]/g, "");
    
    // 🔴 Problem Words (Soft Red) - As requested
    if (["rejected", "broken", "ignore", "miss"].includes(cleanWord)) {
      return "text-[#ff6b6b] drop-shadow-sm"; 
    }
    
    // 🟢 Solution Words (Equis Green)
    if (["equis", "approved", "story", "matters", "resilience"].includes(cleanWord)) {
      return "text-[#00ff88] drop-shadow-[0_0_15px_rgba(0,255,136,0.2)]";
    }

    // 💡 Specific Interaction: Underline "system"
    if (cleanWord === "system") {
      return "underline decoration-[#ff6b6b]/40 underline-offset-8";
    }

    return "text-white";
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        opacity: smoothOpacity, 
        x: smoothX
      }}
      className={cn(
        "text-4xl md:text-6xl font-display font-black tracking-tight leading-[1.1] text-white",
        side === "right" ? "text-right" : side === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {lines.map((line, lineIdx) => (
        <span 
          key={lineIdx} 
          className={cn(
            "block py-4 overflow-hidden", // 🛠️ Increased padding + neutralized margins
            lineIdx > 0 && "font-sans font-light opacity-50 text-xl md:text-3xl tracking-normal mt-2 max-w-xl leading-relaxed italic"
          )}
        >
          {line.split(" ").map((word, wordIdx) => (
            <motion.span
              key={wordIdx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: (lineIdx * 0.1) + (wordIdx * 0.05),
                ease: "easeOut" 
              }}
              viewport={{ once: false }}
              className={cn(
                "inline-block mr-[0.25em]",
                lineIdx === 0 && getWordStyle(word, lineIdx)
              )}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}
