"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function AyatPendekPage() {
  const surahList = [
    {
      id: 1,
      number: 1,
      nameLatin: "Al-Fatihah",
      nameArabic: "الفاتحة",
      translation: "Pembukaan",
      ayahCount: 7,
      progress: 100, // percentage of memorization
    },
    {
      id: 114,
      number: 114,
      nameLatin: "An-Nas",
      nameArabic: "الناس",
      translation: "Manusia",
      ayahCount: 6,
      progress: 100,
    },
    {
      id: 113,
      number: 113,
      nameLatin: "Al-Falaq",
      nameArabic: "الفلق",
      translation: "Waktu Subuh",
      ayahCount: 5,
      progress: 40,
    },
    {
      id: 112,
      number: 112,
      nameLatin: "Al-Ikhlas",
      nameArabic: "الإخلاص",
      translation: "Memurnikan Keesaan Allah",
      ayahCount: 4,
      progress: 0,
    },
    {
      id: 111,
      number: 111,
      nameLatin: "Al-Lahab",
      nameArabic: "المسد",
      translation: "Gejolak Api",
      ayahCount: 5,
      progress: 0,
    },
    {
      id: 110,
      number: 110,
      nameLatin: "An-Nasr",
      nameArabic: "النصر",
      translation: "Pertolongan",
      ayahCount: 3,
      progress: 0,
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FAF8F1] overflow-hidden font-sans">
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/ayat" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0L57 30L85 15L70 43L100 50L70 57L85 85L57 70L50 100L43 70L15 85L30 57L0 50L30 43L15 15L43 30Z" />
          </svg>
        </div>

        {/* Header */}
        <header className="px-8 pt-10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Daftar Surah Pendek
            </h2>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
              Mulai hafalkan Juz 'Amma dengan bantuan pengenalan suara interaktif.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            <input 
              type="text" 
              placeholder="Cari Surah..." 
              className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl focus:ring-[#1885A4] focus:border-[#1885A4] block pl-10 p-3 outline-none transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </header>

        {/* Content Area (List View) */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar z-10">
          <div className="flex flex-col gap-4 w-full">
            {surahList.map((surah, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group cursor-pointer"
              >
                {/* Surah Number (Decorative) */}
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full text-gray-100 group-hover:text-[#1885A4]/10 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L14.4 7.6L20.5 8.2L15.9 12.3L17.2 18.2L12 15.2L6.8 18.2L8.1 12.3L3.5 8.2L9.6 7.6L12 2Z" />
                  </svg>
                  <span className="relative z-10 text-sm font-bold text-gray-500 group-hover:text-[#1885A4] transition-colors">{surah.number}</span>
                </div>

                {/* Surah Details */}
                <div className="flex-1 text-center md:text-left w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1885A4] transition-colors">
                      {surah.nameLatin}
                    </h3>
                    <span className="font-arabic font-bold text-2xl text-gray-800">
                      {surah.nameArabic}
                    </span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-500 font-medium">
                    <span className="uppercase tracking-wider text-xs">{surah.translation}</span>
                    <span className="hidden md:inline text-gray-300">•</span>
                    <span>{surah.ayahCount} Ayat</span>
                  </div>
                </div>

                {/* Progress & Actions */}
                <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 md:pl-6 md:border-l border-gray-100">
                  {/* Progress Ring */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative flex items-center justify-center shrink-0">
                      <svg className="w-full h-full absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path 
                          className={surah.progress === 100 ? "text-emerald-500" : surah.progress > 0 ? "text-[#1885A4]" : "text-transparent"} 
                          strokeWidth="3" 
                          strokeDasharray={`${surah.progress}, 100`} 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        />
                      </svg>
                      <span className={`text-[10px] font-bold ${surah.progress === 100 ? "text-emerald-500" : "text-gray-500"}`}>
                        {surah.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Play / Learn Button */}
                  <button className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-transform hover:scale-105 shrink-0 ${surah.progress === 100 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' : 'bg-[#1885A4] text-white shadow-[#1885A4]/20 hover:bg-[#136b85]'}`}>
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Global styles for custom scrollbar within this layout */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
        
        /* Fallback arabic font for symbols */
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        .font-arabic {
          font-family: 'Amiri', serif;
        }
      `}} />
    </div>
  );
}
