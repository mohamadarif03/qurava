"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function IqraPage() {
  const learningModules = [
    {
      id: "hijaiyah",
      title: "Pengenalan Huruf Hijaiyah",
      description: "Mengenal bentuk dan pelafalan 28 huruf dasar Al-Qur'an.",
      iconText: "ا ب ت",
      status: "completed", // completed, in-progress, locked
      progress: 100,
      color: "bg-teal-500",
      bgLight: "bg-teal-50",
      textColor: "text-teal-500",
      href: "/iqra/hijaiyah",
    },
    {
      id: "harakat",
      title: "Mengenal Harakat",
      description: "Belajar tanda baca dasar: Fathah, Kasrah, dan Dhammah.",
      iconText: "ـَ ـِ ـُ",
      status: "locked",
      progress: 0,
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-500",
      href: "#",
    },
    {
      id: "tanwin",
      title: "Harakat Tanwin",
      description: "Mempelajari bunyi ganda: Fathatain, Kasratain, Dhammatain.",
      iconText: "ـً ـٍ ـٌ",
      status: "locked",
      progress: 0,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-500",
      href: "#",
    },
    {
      id: "sukun-tasydid",
      title: "Sukun & Tasydid",
      description: "Memahami huruf mati dan huruf yang ditekan/digandakan.",
      iconText: "ـْ ـّ",
      status: "locked",
      progress: 0,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-500",
      href: "#",
    },
    {
      id: "mad",
      title: "Hukum Mad Dasar",
      description: "Belajar tata cara memanjangkan bacaan sesuai tajwid.",
      iconText: "آ",
      status: "locked",
      progress: 0,
      color: "bg-indigo-500",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-500",
      href: "#",
    },
    {
      id: "sambung",
      title: "Menyambung Huruf",
      description: "Latihan merangkai huruf hijaiyah di awal, tengah, dan akhir kata.",
      iconText: "صعذ",
      status: "locked",
      progress: 0,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-500",
      href: "#",
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FAF8F1] overflow-hidden font-sans">
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0L57 30L85 15L70 43L100 50L70 57L85 85L57 70L50 100L43 70L15 85L30 57L0 50L30 43L15 15L43 30Z" />
          </svg>
        </div>

        {/* Header */}
        <header className="px-8 pt-10 pb-6 flex flex-col gap-2 z-10 shrink-0">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Materi Pembelajaran Iqra'
          </h2>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Pilih modul pembelajaran di bawah ini. Selesaikan setiap materi secara berurutan untuk membuka materi tingkat selanjutnya.
          </p>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-12 custom-scrollbar z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningModules.map((module, idx) => {
              const CardContent = (
                <div 
                  className={`relative bg-white rounded-3xl p-6 border transition-all duration-300 h-full flex flex-col
                    ${module.status === 'locked' 
                      ? 'border-gray-200 shadow-sm opacity-75 grayscale-[30%] cursor-not-allowed' 
                      : 'border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg hover:-translate-y-1 cursor-pointer group'}
                  `}
                >
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    {module.status === 'completed' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    )}
                    {module.status === 'in-progress' && (
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                    )}
                    {module.status === 'locked' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Module Icon (Typography based) */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${module.status === 'locked' ? 'bg-gray-50 text-gray-400' : `${module.bgLight} ${module.textColor}`}`}>
                    <span className="font-arabic font-bold text-2xl tracking-widest">{module.iconText}</span>
                  </div>

                  {/* Module Info */}
                  <div className="mb-6">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400 mb-1 block">Modul {idx + 1}</span>
                    <h3 className={`text-lg font-bold mb-2 ${module.status === 'locked' ? 'text-gray-500' : 'text-gray-900 group-hover:text-[#1885A4] transition-colors'}`}>
                      {module.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                      {module.description}
                    </p>
                  </div>

                  {/* Progress Bar & Action */}
                  <div className="mt-auto">
                    {module.status !== 'locked' ? (
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">
                          <span>Progress</span>
                          <span className={module.textColor}>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${module.color}`} style={{ width: `${module.progress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full py-2 bg-gray-50 border border-gray-100 rounded-xl text-center">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Selesaikan modul sebelumnya</span>
                      </div>
                    )}
                  </div>
                </div>
              );

              if (module.status === 'locked') {
                return <div key={idx}>{CardContent}</div>;
              }

              return (
                <Link key={idx} href={module.href} className="block h-full">
                  {CardContent}
                </Link>
              );
            })}
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
