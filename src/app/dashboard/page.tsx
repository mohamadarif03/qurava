"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  // Dummy data based on PRD requirements
  const studentData = {
    name: "Ahmad",
    level: "Level 2 Learner",
    streak: 5,
    dailyTarget: 80, // percentage
    averageScore: 92,
    progress: 65, // overall progress percentage
  };

  const recentModules = [
    { title: "Menulis Hijaiyah", subtitle: "Huruf Jim - Kha", type: "writing", progress: 45, color: "bg-teal-500", text: "text-teal-500", bgLight: "bg-teal-50" },
    { title: "Voice Recognition", subtitle: "Makharijul Huruf", type: "voice", progress: 80, color: "bg-orange-500", text: "text-orange-500", bgLight: "bg-orange-50" },
  ];

  const recentSurah = {
    name: "Al-Fatihah",
    ayah: "1-7",
    status: "Memorized",
    score: 95
  };

  const achievements = [
    { title: "7 Days Streak", icon: <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>, color: "bg-orange-100", active: true },
    { title: "Voice Master", icon: <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>, color: "bg-blue-100", active: true },
    { title: "First Surah", icon: <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>, color: "bg-emerald-100", active: false },
  ];

  return (
    <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans">
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/dashboard" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative pb-20 lg:pb-0">
        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none md:hidden">
          <svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0L57 30L85 15L70 43L100 50L70 57L85 85L57 70L50 100L43 70L15 85L30 57L0 50L30 43L15 15L43 30Z" /></svg>
        </div>

        {/* Header */}
        <header className="px-4 pt-5 pb-4 sm:px-5 md:px-8 md:pt-8 md:pb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-end z-10 shrink-0">
          <div>              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              Ahlan wa sahlan, {studentData.name}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Semoga harimu penuh berkah. Mari lanjutkan belajarmu hari ini!</p>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#1885A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            12 Rabi'ul Awal 1448 H
          </div>
        </header>

        {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 sm:px-5 md:px-8 md:pb-10 custom-scrollbar z-10">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            
            {/* Streak Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Learning Streak</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-none">{studentData.streak}</h3>
                  <span className="text-sm font-bold text-orange-500 mb-0.5">Hari Beruntun!</span>
                </div>
              </div>
            </div>

            {/* Daily Target Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] shrink-0 border border-[#1885A4]/20 relative">
                 {/* Mini circular progress */}
                 <svg className="w-full h-full absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#1885A4]" strokeWidth="3" strokeDasharray={`${studentData.dailyTarget}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="text-sm font-bold">{studentData.dailyTarget}%</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Target Harian</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-none">20</h3>
                  <span className="text-sm font-bold text-gray-400 mb-0.5">/ 25 Menit</span>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Nilai Latihan</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-none">{studentData.averageScore}</h3>
                  <span className="text-sm font-bold text-emerald-500 mb-0.5">Rata-rata</span>
                </div>
              </div>
            </div>
            
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Wider) */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Progress Belajar (Overall) */}
            <div className="bg-[#1885A4] rounded-3xl md:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-lg text-white relative overflow-hidden flex flex-col justify-between min-h-[200px] md:min-h-[220px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                
                <div className="relative z-10">
                  <h3 className="font-bold text-xl mb-2">Progress Belajar Keseluruhan</h3>
                  <p className="text-[#1885A4] bg-white/20 inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm mb-6">
                    Tingkat Dasar (Iqra' 1-3)
                  </p>
                </div>
                
                <div className="relative z-10 w-full mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-medium text-sm text-blue-100">Menuju Tingkat Menengah</span>
                    <span className="text-3xl font-black">{studentData.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-white h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                      style={{ width: `${studentData.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Modul Terakhir */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-base md:text-lg text-gray-800">Modul Terakhir</h3>
                  <button className="text-sm font-semibold text-[#1885A4] hover:underline">Lihat Semua</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentModules.map((mod, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${mod.bgLight} ${mod.text} flex items-center justify-center shrink-0`}>
                          {mod.type === 'writing' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                          ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm md:text-gray-900 group-hover:text-[#1885A4] transition-colors">{mod.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{mod.subtitle}</p>
                        </div>
                      </div>
                      
                      {/* Linear Progress bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                          <span>Progress</span>
                          <span className={mod.text}>{mod.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${mod.color}`} style={{ width: `${mod.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column (Narrower) */}
            <div className="flex flex-col gap-8">
              
              {/* Hafalan Terakhir */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                <h3 className="font-bold text-base md:text-lg text-gray-800 mb-4 md:mb-5">Hafalan Terakhir</h3>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 md:p-5 text-white relative overflow-hidden group cursor-pointer">
                  {/* Decor */}
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="flex items-center gap-2 mb-1 relative z-10">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">{recentSurah.status}</span>
                  </div>
                  
                  <h4 className="text-xl md:text-2xl font-black mb-1 relative z-10">{recentSurah.name}</h4>
                  <p className="text-gray-400 text-sm mb-4 relative z-10">Ayat {recentSurah.ayah}</p>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wide">AI Score</span>
                      <span className="font-bold text-lg text-white">{recentSurah.score}/100</span>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex-1">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-base md:text-lg text-gray-800">Pencapaian</h3>
                  <button className="text-sm font-semibold text-[#1885A4] hover:underline">Semua</button>
                </div>
                
                <div className="flex flex-col gap-4">
                  {achievements.map((ach, idx) => (
                    <div key={idx} className={`flex items-center gap-3 md:gap-4 p-2.5 md:p-3 rounded-2xl border ${ach.active ? 'border-gray-100 bg-gray-50/50' : 'border-dashed border-gray-200 opacity-60'}`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0 ${ach.active ? ach.color : 'bg-gray-100 grayscale'}`}>
                        {ach.icon}
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-800 text-xs md:text-sm">{ach.title}</h5>
                        <p className="text-[11px] text-gray-500 mt-0.5">{ach.active ? 'Tercapai' : 'Terkunci'}</p>
                      </div>
                      {ach.active && (
                        <div className="ml-auto text-emerald-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

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
      `}} />
    </div>
  );
}
