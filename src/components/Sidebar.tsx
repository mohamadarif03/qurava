import React from "react";
import Link from "next/link";

interface SidebarProps {
  activePath?: string;
}

export default function Sidebar({ activePath = "/" }: SidebarProps) {
  const getMenuClass = (path: string) => {
    const isActive = activePath === path;
    if (isActive) {
      return "flex items-center gap-3.5 px-4 py-2.5 bg-[#1885A4] text-white rounded-xl font-bold text-[13px] shadow-md shadow-[#1885A4]/20 relative overflow-hidden";
    }
    return "flex items-center gap-3.5 px-4 py-2.5 text-gray-500 hover:bg-white/60 rounded-xl transition-all font-medium text-[13px] group";
  };

  const getIconClass = (path: string) => {
    const isActive = activePath === path;
    if (isActive) {
      return "w-[18px] h-[18px] text-white";
    }
    return "w-[18px] h-[18px] group-hover:text-[#1885A4] transition-colors";
  };

  return (
    <aside className="w-[240px] bg-[#FAF8F1] h-full flex flex-col justify-between py-6 px-5 relative z-10 shrink-0 border-r border-gray-200/40">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <img src="/logo.png" alt="SAHABAT Logo" className="h-10 object-contain drop-shadow-sm" />
          <div className="leading-tight">
            <h1 className="font-black text-lg text-gray-800 tracking-wider uppercase leading-none">SAHABAT</h1>
            <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-semibold">Al-Qur&apos;an Learning</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard" className={getMenuClass("/dashboard")}>
            <svg className={getIconClass("/dashboard")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>
          <Link href="/iqra" className={getMenuClass("/iqra")}>
            <svg className={getIconClass("/iqra")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            Iqra&apos;
          </Link>
          <Link href="/ayat" className={getMenuClass("/ayat")}>
            <svg className={getIconClass("/ayat")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Ayat Pendek
          </Link>
          <Link href="/menulis" className={getMenuClass("/menulis")}>
            <svg className={getIconClass("/menulis")} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
            Menulis Hijaiyah
          </Link>
        </nav>
      </div>

      <div>
        {/* User Profile */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-[#1885A4]/10 rounded-2xl mb-3">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Ahmad" className="w-10 h-10 rounded-full ring-2 ring-white object-cover" />
          <div>
            <p className="text-[13px] font-bold text-gray-800">Ahmad</p>
            <p className="text-[10px] text-gray-500 font-medium">Level 2 Learner</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-500 bg-white hover:bg-[#1885A4]/5 hover:text-[#1885A4] hover:border-[#1885A4]/30 rounded-2xl text-[13px] font-semibold transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
