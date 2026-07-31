"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Pilih Profil Akses",
      desc: "Setiap individu memiliki kebutuhan yang unik. SAHABAT menyediakan profil khusus seperti mode visual tinggi (Tunanetra) hingga antarmuka ramah disleksia.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      visual: (
        <div className="flex gap-4 mt-6">
          <div className="px-4 py-2 rounded-full border border-[#1885A4] text-[#1885A4] text-xs font-bold bg-[#1885A4]/5">Tunanetra</div>
          <div className="px-4 py-2 rounded-full border border-gray-200 text-gray-400 text-xs font-bold">Tunarungu</div>
          <div className="px-4 py-2 rounded-full border border-gray-200 text-gray-400 text-xs font-bold">Disleksia</div>
        </div>
      )
    },
    {
      id: "02",
      title: "Mulai Berinteraksi",
      desc: "Tidak hanya membaca, Anda bisa berinteraksi langsung. AI kami mengenali suara bacaan, mendeteksi isyarat tangan, hingga membaca goresan kaligrafi Anda.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
      visual: (
        <div className="mt-8 flex items-end gap-2 h-12">
          {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
            <motion.div 
              key={i}
              className="w-2 bg-[#1885A4] rounded-t-full"
              initial={{ height: "10%" }}
              animate={{ height: `${h}%` }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.5 + (i * 0.1) }}
            />
          ))}
        </div>
      )
    },
    {
      id: "03",
      title: "Dapatkan Evaluasi AI",
      desc: "Sistem cerdas kami langsung menganalisis presisi tajwid dan kelancaran Anda, memberikan koreksi suportif agar Anda terus berkembang.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      visual: (
        <div className="mt-8 relative">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#1885A4]"
              initial={{ width: "0%" }}
              whileInView={{ width: "95%" }}
              transition={{ duration: 1.5, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold">
            <span className="text-gray-400">Presisi Tajwid</span>
            <span className="text-[#1885A4]">95% Sangat Baik</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#FFFDF8] relative border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        
        {/* Left Sticky Column */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
            <span className="text-[#1885A4] text-sm font-sans font-bold tracking-[0.2em] uppercase mb-4 block">
              Cara Kerja
            </span>
            <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] leading-[1.0] tracking-tight mb-6 uppercase">
              Belajar dalam Tiga Langkah
            </h2>
            <p className="text-gray-500 font-sans leading-relaxed text-[15px] mb-8">
              SAHABAT menghilangkan kompleksitas teknis. Anda hanya perlu memilih preferensi, dan AI kami akan menyusun pengalaman belajar yang paling intuitif untuk Anda.
            </p>
            
            <a href="#mulai" className="inline-flex items-center gap-3 text-[#1885A4] font-bold text-sm hover:gap-4 transition-all">
              Mulai Sekarang 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>

        {/* Right Scroll Column */}
        <div className="lg:w-2/3 flex flex-col gap-12 md:gap-24">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="relative pl-8 md:pl-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Vertical Line connecting steps */}
              {index !== steps.length - 1 && (
                <div className="absolute left-0 md:left-4 top-16 bottom-[-3rem] md:bottom-[-6rem] w-[2px] bg-gradient-to-b from-[#1885A4]/20 to-transparent" />
              )}
              
              {/* Node Dot */}
              <div className="absolute left-[-5px] md:left-[11px] top-4 w-3 h-3 bg-[#1885A4] rounded-full shadow-[0_0_10px_rgba(24,133,164,0.5)]" />

              <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(24,133,164,0.05)] transition-shadow duration-500 group overflow-hidden relative">
                
                {/* Huge Watermark Number */}
                <div className="absolute -right-8 -top-12 text-[150px] font-black text-[#1885A4]/5 select-none transition-transform duration-700 group-hover:scale-110">
                  {step.id}
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#1885A4]/10 text-[#1885A4] flex items-center justify-center mb-8">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-2xl font-sans font-bold text-gray-900 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-500 font-sans leading-relaxed text-[15px] mb-8">
                    {step.desc}
                  </p>

                  {/* Abstract Visual Element inside the card */}
                  <div className="pt-6 border-t border-gray-50">
                    {step.visual}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
