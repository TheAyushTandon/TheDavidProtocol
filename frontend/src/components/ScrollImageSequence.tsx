"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollImageSequenceProps {
  frameCount: number;
  baseUrl: string;
  extension: string;
}

export function ScrollImageSequence({
  frameCount,
  baseUrl,
  extension,
}: ScrollImageSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔄 Preload Images
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${baseUrl}${i.toString().padStart(3, "0")}${extension}`;
      preloadedImages.push(img);
    }
    imagesRef.current = preloadedImages;
  }, [frameCount, baseUrl, extension]);

  useGSAP(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // 🏆 GSAP Scroll Animation
    const airbnb = { frame: 0 };
    
    const render = () => {
      const img = imagesRef.current[Math.round(airbnb.frame)];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      
      // 🏆 Advanced Centering & Cropping
      // Hide watermark (2.5%) and Shift phone to center (since it's right-heavy in frames)
      const cropBottomPercent = 0.025;
      const sWidth = img.width;
      const sHeight = img.height * (1 - cropBottomPercent);
      
      // Use a pure "Cover" scale to fill the entire screen
      const scale = Math.max(canvas.width / sWidth, canvas.height / sHeight);
      const dWidth = sWidth * scale;
      const dHeight = sHeight * scale;
      
      // 🎯 RIGHT SHIFT: Adjust the multiplier to move it further right
      // Try 0.1, 0.2, etc. (0 will be centered)
      const rightShift = dWidth * 0.045; 

      const dx = (canvas.width - dWidth) / 2 + rightShift; // ➕ Change to plus
      const dy = (canvas.height - dHeight) / 2;


      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    // Initialize first frame if available
    if (imagesRef.current[0]) {
      imagesRef.current[0].onload = render;
    }

    gsap.to(airbnb, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: "main",      // Track the whole page scroll
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,           // Smooth scrub for that "Professional" feel
      },
      onUpdate: render,
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      // We don't call scale(dpr) here because we draw with physical dimensions for maximum sharpness
      render();
    };

    window.addEventListener("resize", resize);
    resize();
    
    return () => window.removeEventListener("resize", resize);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
