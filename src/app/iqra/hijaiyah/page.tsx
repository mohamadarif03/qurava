"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HijaiyahDetailPage() {
  const router = useRouter();
  const [accMode, setAccMode] = useState<string>("reguler");

  useEffect(() => {
    const mode = localStorage.getItem("accessibility_mode") || "reguler";
    const setupTimeout = window.setTimeout(() => {
      setAccMode(mode);
      if (mode === "tunanetra") {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance("Anda berada di menu huruf Hijaiyah. Tekan tombol Tab untuk menyusuri daftar huruf. Tekan Enter untuk memilih.");
        msg.lang = 'id-ID';
        window.speechSynthesis.speak(msg);
      }
    }, 0);

    return () => window.clearTimeout(setupTimeout);
  }, []);

  const speakNav = (text: string) => {
    if (accMode === "tunanetra") {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'id-ID';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleLetterClick = (letterId: string, letterName: string) => {
    if (accMode === "tunanetra") {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(`Memasuki pelatihan huruf ${letterName}`);
      msg.lang = 'id-ID';
      window.speechSynthesis.speak(msg);
      router.push(`/iqra/hijaiyah/${letterId}`);
    } else if (accMode === "tunarungu") {
      router.push(`/iqra/hijaiyah/${letterId}/gesture`);
    } else {
      router.push(`/iqra/hijaiyah/${letterId}`);
    }
  };

  const hijaiyahLetters = [
    { id: "alif", char: "ا", name: "Alif" },
    { id: "baa", char: "ب", name: "Ba" },
    { id: "ta", char: "ت", name: "Ta" },
    { id: "tsa", char: "ث", name: "Tsa" },
    { id: "jim", char: "ج", name: "Jim" },
    { id: "ha1", char: "ح", name: "Ha" },
    { id: "kha", char: "خ", name: "Kha" },
    { id: "dal", char: "د", name: "Dal" },
    { id: "dzal", char: "ذ", name: "Dzal" },
    { id: "ra", char: "ر", name: "Ra" },
    { id: "zai", char: "ز", name: "Zai" },
    { id: "sin", char: "س", name: "Sin" },
    { id: "syin", char: "ش", name: "Syin" },
    { id: "shad", char: "ص", name: "Shad" },
    { id: "dhad", char: "ض", name: "Dhad" },
    { id: "tha", char: "ط", name: "Tha" },
    { id: "zha", char: "ظ", name: "Zha" },
    { id: "ain", char: "ع", name: "Ain" },
    { id: "ghain", char: "غ", name: "Ghain" },
    { id: "fa", char: "ف", name: "Fa" },
    { id: "qaf", char: "ق", name: "Qaf" },
    { id: "kaf", char: "ك", name: "Kaf" },
    { id: "lam", char: "ل", name: "Lam" },
    { id: "mim", char: "م", name: "Mim" },
    { id: "nun", char: "ن", name: "Nun" },
    { id: "waw", char: "و", name: "Waw" },
    { id: "ha2", char: "ه", name: "Ha" },
    { id: "ya", char: "ي", name: "Ya" },
  ];

  return (
    <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans relative">
      
      {/* ═══════════════ BACKGROUND EFFECTS ═══════════════ */}
      {/* Massive subtle watermark */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 pointer-events-none select-none overflow-hidden opacity-[0.02] mix-blend-multiply flex items-center justify-center">
        <span className="font-arabic text-[600px] leading-none text-[#1885A4]">ا ب ت</span>
      </div>

      {/* Mesh Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1885A4]/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative z-10 pb-20 lg:pb-0">
        
        {/* Header */}
        <header className="px-5 pt-6 pb-4 flex flex-col gap-3 shrink-0 border-b border-gray-200/40 bg-white/30 backdrop-blur-md md:px-10 md:pt-10 md:pb-8">
          <Link 
            href="/iqra" 
            onFocus={() => speakNav("Tombol Kembali ke Modul Utama Iqra")}
            onMouseEnter={() => speakNav("Tombol Kembali ke Modul Utama Iqra")}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1885A4] transition-colors w-fit group outline-none focus:ring-2 focus:ring-[#1885A4] focus:text-[#1885A4] rounded-lg px-2 py-1 -ml-2"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Modul
          </Link>

          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-[#1885A4] to-emerald-600">
              Huruf Hijaiyah
            </h2>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed mt-2">
              Latih pelafalan Anda. Sentuh setiap kartu untuk mendengarkan bacaan yang benar.
            </p>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-20 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
            {hijaiyahLetters.map((letter, idx) => {
              // The migrated AI models support the complete Hijaiyah set.
              const isLocked = false;

              const CardContent = (                  <div
                  className={`relative backdrop-blur-xl rounded-2xl md:rounded-3xl p-3 md:p-6 border shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center gap-3 aspect-[4/5] transition-all duration-500 overflow-hidden h-full ${
                    isLocked 
                      ? 'bg-gray-100/50 border-gray-200 opacity-60 grayscale cursor-not-allowed' 
                      : 'bg-white/70 group border-white/60 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(24,133,164,0.15)] hover:border-[#1885A4]/30 hover:bg-white cursor-pointer'
                  }`}
                >
                  {/* Lock Icon for Locked items */}
                  {isLocked && (
                    <div className="absolute top-4 right-4 text-gray-400">
                      <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                  )}

                  {/* Decorative Hover Ring */}
                  {!isLocked && <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#1885A4]/10 rounded-3xl transition-colors duration-500 pointer-events-none scale-105 group-hover:scale-100 opacity-0 group-hover:opacity-100"></div>}

                  {/* Animated Background Blob */}
                  {!isLocked && <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#1885A4]/20 to-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-150"></div>}

                  {/* Audio Icon (Hidden by default, shows on hover) */}
                  {!isLocked && (
                    <div className="absolute top-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#1885A4] transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </div>
                  )}

                  {/* Arabic Letter */}
                  <span className={`font-arabic font-bold text-4xl md:text-6xl drop-shadow-sm transition-all duration-500 relative z-10 ${
                    isLocked ? 'text-gray-400' : 'text-gray-700 group-hover:text-[#1885A4] group-hover:scale-110 group-hover:-translate-y-1'
                  }`}>
                    {letter.char}
                  </span>

                  {/* Latin Name Container */}
                  <div className={`w-full text-center relative z-10 mt-auto pt-3 md:pt-4 border-t transition-colors duration-300 ${
                    isLocked ? 'border-gray-200' : 'border-gray-100/50 group-hover:border-[#1885A4]/20'
                  }`}>
                    <span className={`text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isLocked ? 'text-gray-400' : 'text-gray-400 group-hover:text-[#1885A4]'
                    }`}>
                      {letter.name}
                    </span>
                  </div>
                </div>
              );

              if (isLocked) {
                return <div key={idx}>{CardContent}</div>;
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleLetterClick(letter.id, letter.name)}
                  className="block h-full outline-none focus:ring-2 focus:ring-[#1885A4]/50 rounded-3xl text-left"
                >
                  {CardContent}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Global styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(229, 231, 235, 0.6);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(209, 213, 219, 0.8);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        .font-arabic {
          font-family: 'Amiri', serif;
        }
      `}} />
    </div>
  );
}
