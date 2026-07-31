"use client";

export default function FooterCTA() {
  return (
    <div className="bg-[#FFFDF8] relative mt-12">
      {/* CTA Banner Layered over the footer */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 -mb-16">
        <div className="bg-[#1885A4] rounded-2xl md:rounded-[2rem] p-8 md:p-12 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
          {/* Subtle Abstract Background for Banner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h3 className="text-2xl md:text-3xl font-sans font-black uppercase tracking-tight leading-[1.0] mb-2">
              Siap Memulai Perjalanan Spiritual?
            </h3>
            <p className="text-white/80 font-sans text-sm md:text-base">
              Bergabunglah sekarang dan rasakan pengalaman belajar Al-Qur'an tanpa batasan.
            </p>
          </div>
          
          <div className="relative z-10 flex-shrink-0">
            <a 
              href="#daftar" 
              className="inline-block px-8 py-3 rounded-full bg-white text-[#1885A4] font-sans font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Mulai Gratis
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <footer className="bg-[#F8F9FA] pt-32 pb-16 px-6 relative z-10 text-[#111827]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-4">
          
          {/* Logo & Socials */}
          <div className="md:w-1/3">
            <div className="flex items-center mb-6">
              <span className="text-[#1885A4] font-sans font-black text-3xl tracking-widest uppercase">
                [SAHABAT]
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-sans">
              Platform pembelajaran Al-Qur'an pertama yang didesain 100% inklusif dengan dukungan kecerdasan buatan.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1885A4] flex items-center justify-center text-white hover:bg-[#136b85] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1885A4] flex items-center justify-center text-white hover:bg-[#136b85] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1885A4] flex items-center justify-center text-white hover:bg-[#136b85] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-sans font-bold text-[#111827] mb-4 uppercase tracking-wider text-sm">Platform</h4>
              <ul className="flex flex-col gap-2 font-sans text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Beranda</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Fitur AI</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Cara Kerja</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Harga</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-[#111827] mb-4 uppercase tracking-wider text-sm">Aksesibilitas</h4>
              <ul className="flex flex-col gap-2 font-sans text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Profil Tunanetra</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Profil Tunarungu</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Dukungan Disleksia</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Navigasi Penuh</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-sans font-bold text-[#111827] mb-4 uppercase tracking-wider text-sm">Dukungan</h4>
              <ul className="flex flex-col gap-2 font-sans text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Kontak Kami</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Syarat Ketentuan</a></li>
                <li><a href="#" className="hover:text-[#1885A4] transition-colors">Kebijakan Privasi</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
