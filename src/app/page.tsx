import SequenceScroll from "@/components/SequenceScroll";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FooterCTA from "@/components/FooterCTA";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-[#9CC7B5]/30 selection:text-[#1885A4]">
      
      {/* Interactive Sticky Navbar */}
      <Navbar />

      {/* Hero Scrollytelling Sequence Section */}
      <main className="flex-1">
        <SequenceScroll />

        {/* New Feature section based on reference */}
        <section id="fitur" className="relative z-20 -mt-[100vh] bg-[#FFFDF8] rounded-t-[2.5rem] md:rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Top Section */}
          <div className="py-24 px-6 md:px-16 lg:px-24 max-w-[1400px] mx-auto">
            <h2 className="text-4xl md:text-5xl font-sans font-black text-[#111827] mb-16 uppercase tracking-tight leading-[1.0] max-w-2xl">
              Fasilitas Aksesibilitas untuk Semua Metode Belajar
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12">
              {/* Item 1 */}
              <div className="flex flex-col items-center text-center px-6 lg:border-r border-gray-100 last:border-0 relative">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Mic Icon for Voice Recognition */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Voice<br/>Recognition</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Koreksi hafalan otomatis menggunakan AI cerdas.</p>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-center text-center px-6 lg:border-r border-gray-100 last:border-0 relative">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Hand Icon for Gesture */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Gesture<br/>Recognition</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Belajar mengaji dengan dukungan bahasa isyarat.</p>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-center text-center px-6 lg:border-r border-gray-100 last:border-0 relative">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Pen Icon for Handwriting */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Handwriting<br/>Recognition</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Evaluasi penulisan kaligrafi dan huruf hijaiyah.</p>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col items-center text-center px-6 lg:border-r border-gray-100 last:border-0 relative">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Eye/Text Icon for Dyslexia/Vision */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Ramah<br/>Disleksia</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Teks kontras tinggi dengan font khusus disleksia.</p>
              </div>

              {/* Item 5 */}
              <div className="flex flex-col items-center text-center px-6 lg:border-r border-gray-100 last:border-0 relative">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Keyboard Icon */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Keyboard<br/>Navigation</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Navigasi penuh tanpa mouse & dukungan Screen Reader.</p>
              </div>

              {/* Item 6 */}
              <div className="flex flex-col items-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-6">
                  {/* Speaker Icon for Speech Synthesis */}
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z"/></svg>
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug">Speech<br/>Synthesis</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Pembaca instruksi dan umpan balik otomatis.</p>
              </div>
            </div>
          </div>

          {/* Bottom Section (Vault) */}
          <div className="bg-[#F8F9FA] py-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Content */}
              <div>
                <h2 className="text-3xl md:text-4xl font-sans font-black text-[#111827] mb-3 uppercase tracking-tight leading-[1.0]">
                  Pengalaman Belajar Inklusif
                </h2>
                <p className="text-gray-500 font-sans text-lg mb-12">
                  Satu platform, hadir untuk setiap kebutuhan Anda.
                </p>

                <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-4">
                      {/* Blind icon representation */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Tunanetra Mode</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Dukungan Screen Reader dan panduan audio penuh.</p>
                  </div>

                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Tunarungu Mode</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Interaksi visual komprehensif dan teks penjelasan.</p>
                  </div>

                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Tunawicara Mode</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Belajar merespons menggunakan input isyarat.</p>
                  </div>

                  <div>
                    <div className="w-10 h-10 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-[#1885A4] mb-4">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 mb-1">Pengaturan Fleksibel</h4>
                    <p className="text-[12px] text-gray-500 leading-relaxed">Sesuaikan profil aksesibilitas dengan mudah.</p>
                  </div>
                </div>
              </div>

              {/* Right Mockup Card */}
              <div className="relative">
                {/* Decorative Sparkles */}
                <svg className="absolute -top-8 -left-8 w-12 h-12 text-[#1885A4]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative z-10">
                  {/* Top Search Bar */}
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <span className="text-[13px] text-gray-400">Cari materi dengan teks atau suara...</span>
                    </div>
                  </div>

                  <div className="flex">
                    {/* Sidebar */}
                    <div className="w-1/3 bg-white border-r border-gray-50 p-4">
                      <div className="bg-[#1885A4]/10 text-[#1885A4] font-bold text-[12px] px-3 py-2 rounded-md mb-2">Profil Akses</div>
                      <div className="text-gray-500 font-medium text-[12px] px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">Default Mode</div>
                      <div className="text-gray-500 font-medium text-[12px] px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">Tunanetra (Blind)</div>
                      <div className="text-gray-500 font-medium text-[12px] px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">Tunarungu (Deaf)</div>
                      <div className="text-gray-500 font-medium text-[12px] px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">Tunawicara (Mute)</div>
                      <div className="text-gray-500 font-medium text-[12px] px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer">Low Vision</div>
                    </div>

                    {/* Content List */}
                    <div className="w-2/3 p-4 bg-white flex flex-col gap-4">
                      
                      {/* Video Item 1 */}
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-16 bg-gray-200 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src="/sequence/Quran_opening_with_light_202607310822_079.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt=""/>
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">Audio AI</div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[13px] font-bold text-gray-900 leading-tight mb-1">Evaluasi Hafalan Al-Fatihah</h5>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-[#1885A4]/20 rounded-full flex justify-center items-center"><svg className="w-2 h-2 text-[#1885A4]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>
                            <span className="text-[11px] text-gray-500">Voice Recognition</span>
                          </div>
                        </div>
                        <button className="text-[11px] font-bold text-[#1885A4] border border-[#1885A4]/30 px-3 py-1 rounded hover:bg-[#1885A4]/5">Mulai</button>
                      </div>

                      {/* Video Item 2 */}
                      <div className="flex gap-4 items-center">
                        <div className="w-24 h-16 bg-gray-200 rounded-lg relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <img src="/sequence/Quran_opening_with_light_202607310822_010.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply" alt=""/>
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">Visual</div>
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[13px] font-bold text-gray-900 leading-tight mb-1">Dasar Isyarat Hijaiyah</h5>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 bg-[#1885A4]/20 rounded-full flex justify-center items-center"><svg className="w-2 h-2 text-[#1885A4]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>
                            <span className="text-[11px] text-gray-500">Gesture Recognition</span>
                          </div>
                        </div>
                        <button className="text-[11px] font-bold text-[#1885A4] border border-[#1885A4]/30 px-3 py-1 rounded hover:bg-[#1885A4]/5">Praktik</button>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Decorative Bottom Circle */}
                <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full border-4 border-[#1885A4]/10"></div>
              </div>
              
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}
        <Testimonials />
      </main>

      {/* New Enhanced Footer with CTA */}
      <FooterCTA />
    </div>
  );
}
