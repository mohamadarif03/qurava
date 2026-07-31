"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hero section sequence animation takes up roughly 200vh-300vh.
      // We change the navbar when we scroll past 200vh, which is when the Hero section fully finishes.
      if (window.scrollY > window.innerHeight * 1.8) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 lg:px-12 pt-4 md:pt-6 flex justify-center pointer-events-none">
      <header 
        className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-out ${
          scrolled 
            ? 'w-full max-w-5xl bg-[#1885A4]/40 backdrop-blur-lg shadow-lg py-3 px-6 md:px-8 rounded-full border border-white/20' 
            : 'w-full max-w-full bg-transparent py-2 px-2 md:px-4'
        }`}
      >
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="font-sans font-bold text-2xl tracking-widest text-[#FFFDF8] drop-shadow-sm">
            [SAHABAT]
          </span>
        </div>
        
        {/* Right: Nav Links + Button */}
        <div className="flex items-center gap-10">
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-sans font-normal text-[#FFFDF8] drop-shadow-sm">
            <a href="#fitur" className="hover:opacity-70 transition-opacity">Fitur</a>
            <a href="#baca" className="hover:opacity-70 transition-opacity">Cara Kerja</a>
            <a href="#tentang" className="hover:opacity-70 transition-opacity">Tentang</a>
          </nav>

          <a
            href="#baca"
            className="px-6 py-2.5 font-sans font-bold text-[14px] rounded-full transition-all duration-300 shadow-lg flex items-center gap-2 bg-[#FFFDF8] text-[#1885A4] hover:bg-gray-100"
          >
            Mulai Belajar
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>
        </div>
      </header>
    </div>
  );
}
