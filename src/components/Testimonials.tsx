"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);

  const testimonials = [
    {
      id: 0,
      name: "Rina Amelia",
      role: "Pengguna Umum",
      text: "Fitur evaluasi tajwid berbasis AI sangat membantu saya memperbaiki bacaan secara mandiri. Evaluasinya sangat akurat dan mudah dipahami.",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      stars: 5,
    },
    {
      id: 1,
      name: "Ahmad Fauzi",
      role: "Penyandang Tunanetra",
      text: "Screen reader dan antarmuka audionya sangat responsif. Untuk pertama kalinya saya bisa belajar menghafal Al-Qur'an secara mandiri tanpa bergantung pada orang lain.",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      stars: 5,
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Guru SLB",
      text: "Deteksi bahasa isyaratnya luar biasa! Anak-anak didik saya yang tunarungu kini jauh lebih antusias belajar hijaiyah karena ada umpan balik visual langsung.",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
      stars: 5,
    },
    {
      id: 3,
      name: "Budi Santoso",
      role: "Penyandang Disleksia",
      text: "Font khusus disleksia dan mode high-contrast membuat teks Arab tidak lagi terlihat melompat-lompat. Belajar mengaji jadi jauh lebih nyaman sekarang.",
      avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
      stars: 5,
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Kalkulasi posisi kartu (seolah-olah circular)
  const getCardPosition = (index: number) => {
    const diff = (index - activeIndex + testimonials.length) % testimonials.length;
    if (diff === 0) return 0; // Center
    if (diff === 1) return 1; // Right
    if (diff === testimonials.length - 1) return -1; // Left
    return 2; // Hidden/Far Right
  };

  return (
    <section className="py-24 md:py-32 bg-[#FFFDF8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] uppercase tracking-tight leading-[1.0] mb-6">
          Pengalaman Mereka
        </h2>
        <p className="text-gray-500 font-sans text-lg max-w-2xl mx-auto">
          Lihat bagaimana SAHABAT membantu berbagai individu mencapai tujuan spiritual mereka tanpa batasan.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto h-[400px] md:h-[350px] flex items-center justify-center">
        
        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 md:left-12 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1885A4] hover:bg-[#1885A4] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-4 md:right-12 z-40 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1885A4] hover:bg-[#1885A4] hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Cards Container */}
        <div className="relative w-full max-w-[800px] h-full flex justify-center items-center perspective-[1000px]">
          <AnimatePresence>
            {testimonials.map((testi, index) => {
              const pos = getCardPosition(index);
              if (Math.abs(pos) > 1 && testimonials.length > 3) return null; // Sembunyikan yang di luar jangkauan jika banyak

              return (
                <motion.div
                  key={testi.id}
                  initial={{ opacity: 0, x: pos > 0 ? 100 : -100, scale: 0.8 }}
                  animate={{ 
                    opacity: pos === 0 ? 1 : 0.4, 
                    x: pos === 0 ? 0 : pos > 0 ? "55%" : "-55%",
                    scale: pos === 0 ? 1.05 : 0.85,
                    zIndex: pos === 0 ? 30 : 10,
                    filter: pos === 0 ? "blur(0px)" : "blur(2px)"
                  }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                  className={`absolute w-[280px] md:w-[400px] bg-white rounded-2xl p-8 cursor-pointer transition-shadow ${pos === 0 ? 'shadow-[0_20px_50px_rgba(24,133,164,0.25)]' : 'shadow-md'}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <img src={testi.avatar} alt={testi.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#1885A4]/20" />
                    <div className="text-left">
                      <h4 className="font-sans font-bold text-gray-900 text-[15px] leading-tight">{testi.name}</h4>
                      <span className="text-xs text-[#1885A4] font-medium">{testi.role}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-500 font-sans text-[14px] leading-relaxed mb-6 text-left">
                    "{testi.text}"
                  </p>

                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < testi.stars ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
