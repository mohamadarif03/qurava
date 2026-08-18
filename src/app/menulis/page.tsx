"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";

export default function MenulisPage() {
  const [activeLetter, setActiveLetter] = useState("alif");
  
  // Drawing States
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#111827"); // Default: gray-900
  const [brushSize, setBrushSize] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tracking points for evaluation
  const strokePointsRef = useRef<{x: number, y: number}[]>([]);

  // Mock AI Evaluation States
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{ score: number, message: string } | null>(null);

  const hijaiyah = [
    { id: "alif", char: "ا", name: "Alif" },
    { id: "ba", char: "ب", name: "Ba" },
    { id: "ta", char: "ت", name: "Ta" },
    { id: "tsa", char: "ث", name: "Tsa" },
    { id: "jim", char: "ج", name: "Jim" },
    { id: "ha", char: "ح", name: "Ha" },
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

  const kataDasar = ["ص", "ع", "ذ", "م"];
  const activeDef = hijaiyah.find(h => h.id === activeLetter);

  // Resize canvas to fit its container on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, []);

  // Clear canvas when letter changes
  useEffect(() => {
    clearCanvas();
  }, [activeLetter]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setEvalResult(null); // Clear previous result on new drawing

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Save tracking point
    strokePointsRef.current.push({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.stroke();

    // Save tracking point
    strokePointsRef.current.push({ x, y });
  };

  const endDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokePointsRef.current = [];
    setEvalResult(null);
  };

  const evaluateDrawing = () => {
    setIsEvaluating(true);
    setEvalResult(null);

    // Mock evaluation delay (1.5 seconds)
    setTimeout(() => {
      setIsEvaluating(false);
      
      const points = strokePointsRef.current;

      if (points.length < 5) {
        setEvalResult({ score: 0, message: "Kertas masih kosong! Silakan tulis sesuatu terlebih dahulu." });
        return;
      }

      let finalScore = 0;
      let finalMessage = "";

      if (activeLetter === "alif") {
        // --- VECTOR PATH ALGORITHM FOR ALIF ---
        // Alif is ideally a vertical straight line at the center of the canvas.
        const canvas = canvasRef.current;
        const centerX = canvas ? canvas.width / 2 : 250;
        
        let totalDeviation = 0;
        let minY = points[0].y;
        let maxY = points[0].y;
        
        for(let pt of points) {
           totalDeviation += Math.abs(pt.x - centerX);
           if (pt.y < minY) minY = pt.y;
           if (pt.y > maxY) maxY = pt.y;
        }
        
        const avgDeviation = totalDeviation / points.length;
        const strokeHeight = maxY - minY;
        
        let score = 100;
        
        // Penalty for being off-center or wavy
        if (avgDeviation > 30) score -= (avgDeviation - 30) * 1.2;
        
        // Penalty for being too short (Alif should be tall)
        if (strokeHeight < 120) score -= (120 - strokeHeight) * 0.4;
        
        // Bound score
        finalScore = Math.max(10, Math.min(100, Math.round(score)));

        if (finalScore >= 90) finalMessage = "Luar biasa! Garis Alif Anda sangat tegak dan berada tepat di tengah (sesuai kaidah).";
        else if (finalScore >= 70) finalMessage = "Bagus! Namun garis Alif masih sedikit bengkok atau kurang tinggi.";
        else finalMessage = "Coretan terlalu melenceng dari panduan lurus Alif. Coba ikuti garis bayangannya pelan-pelan ya!";

      } else if (activeLetter === "ba") {
        // --- VECTOR PATH ALGORITHM FOR BA ---
        // Ba is a wide boat-like shape. We use bounding box heuristics.
        let minX = points[0].x;
        let maxX = points[0].x;
        let minY = points[0].y;
        let maxY = points[0].y;
        
        for(let pt of points) {
           if (pt.x < minX) minX = pt.x;
           if (pt.x > maxX) maxX = pt.x;
           if (pt.y < minY) minY = pt.y;
           if (pt.y > maxY) maxY = pt.y;
        }

        const width = maxX - minX;
        const height = maxY - minY;
        
        let score = 100;

        // Ba must be significantly wide
        if (width < 150) {
          score -= (150 - width) * 0.8;
        }

        // Ba should be horizontal, not vertical. If height > width, it's very wrong.
        if (height > width) {
          score -= (height - width) * 0.5;
        }

        // Check if there's a dot? Simplified: just reward wide strokes with moderate height
        if (height < 30) {
           // Too flat, maybe just a dash
           score -= 20;
        }

        finalScore = Math.max(10, Math.min(100, Math.round(score)));

        if (finalScore >= 90) finalMessage = "Tepat sekali! Bentuk perahu dari huruf Ba terlihat mendatar dan proporsional.";
        else if (finalScore >= 70) finalMessage = "Cukup baik, tetapi coba buat cekungannya lebih seimbang dan panjang.";
        else finalMessage = "Sepertinya proporsinya kurang tepat. Ingat, Ba harus mendatar lebar ke samping, bukan meninggi ke atas.";

      } else {
        // --- RANDOM SIMULATION FOR OTHER LETTERS ---
        finalScore = Math.floor(Math.random() * 41) + 60;
        if (finalScore >= 90) finalMessage = "Sempurna! Proporsi dan arah tulisan sudah sangat tepat layaknya ahli.";
        else if (finalScore >= 75) finalMessage = "Bagus! Terus berlatih agar goresan lebih halus dan presisi.";
        else finalMessage = "Cukup baik, tapi masih perlu mengikuti garis panduan (tracing) dengan lebih perlahan.";
      }

      setEvalResult({ score: finalScore, message: finalMessage });
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF8F1] overflow-hidden font-sans">
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/menulis" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">

        {/* Decorative Islamic geometric pattern (bottom-right) */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-[0.04] pointer-events-none z-0">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="#1885A4" strokeWidth="1.5">
              <circle cx="400" cy="400" r="50" />
              <circle cx="400" cy="400" r="100" />
              <circle cx="400" cy="400" r="150" />
              <circle cx="400" cy="400" r="200" />
              <circle cx="400" cy="400" r="250" />
              <circle cx="400" cy="400" r="300" />
              <circle cx="400" cy="400" r="350" />
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                return (
                  <line key={i} x1="400" y1="400" x2={400 + 400 * Math.cos(angle)} y2={400 + 400 * Math.sin(angle)} />
                );
              })}
              <path d="M400 300 L420 370 L490 370 L430 410 L450 480 L400 440 L350 480 L370 410 L310 370 L380 370 Z" />
              <path d="M400 250 L430 350 L530 350 L450 420 L480 520 L400 460 L320 520 L350 420 L270 350 L370 350 Z" />
            </g>
          </svg>
        </div>

        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex justify-between items-end z-10 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Menulis Hijaiyah <span className="text-2xl">✍️</span>
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Latih tanganmu menulis huruf-huruf Arab dengan benar</p>
          </div>
          <div className="text-[13px] font-medium text-gray-400 flex items-center gap-2">
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Beranda</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Iqra&apos;</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            <span className="hover:text-gray-700 cursor-pointer transition-colors">Hijaiyah</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            <span className="text-[#1885A4] font-bold">Menulis</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 z-10">
          <div className="flex gap-6 h-full min-h-[580px]">
            
            {/* ═══════ BOOK (Left Page + Right Page) ═══════ */}
            <div className="flex-1 flex rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden relative bg-white">
              
              {/* ── LEFT PAGE: Daftar Huruf ── */}
              <div className="w-[280px] shrink-0 bg-white flex flex-col border-r-0 relative">
                {/* Subtle page edge shadow */}
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-r from-gray-200 to-gray-300 z-20"></div>
                
                <div className="p-5 flex-1 flex flex-col overflow-hidden">
                  <h3 className="font-bold text-gray-800 mb-3 text-[15px]">Daftar Huruf Hijaiyah</h3>
                  <div className="grid grid-cols-4 gap-1.5 overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {hijaiyah.map((item, idx) => {
                      const isLocked = idx >= 2; // Lock from 'Ta' onwards
                      
                      return (
                        <button
                          key={item.id}
                          disabled={isLocked}
                          onClick={() => !isLocked && setActiveLetter(item.id)}
                          className={`flex flex-col items-center justify-center py-2 rounded-lg border transition-all duration-200 relative ${
                            isLocked 
                              ? 'border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed grayscale opacity-60'
                              : activeLetter === item.id
                                ? 'border-[#1885A4] bg-[#1885A4] text-white shadow-md scale-105'
                                : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-800'
                          }`}
                        >
                          {isLocked && (
                            <div className="absolute top-1 right-1 text-gray-400">
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                              </svg>
                            </div>
                          )}
                          <span className="text-lg leading-none font-bold mb-0.5">{item.char}</span>
                          <span className={`text-[9px] ${
                            isLocked ? 'text-gray-300' : activeLetter === item.id ? 'text-blue-100' : 'text-gray-400'
                          }`}>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Latihan Kata Dasar */}
                <div className="p-5 border-t border-gray-100">
                  <h3 className="font-bold text-gray-800 mb-3 text-[15px]">Latihan Kata Dasar</h3>
                  <div className="flex gap-3">
                    {kataDasar.map((char, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-700 border border-gray-100 cursor-pointer hover:bg-[#1885A4]/10 hover:text-[#1885A4] hover:border-[#1885A4]/30 transition-all">
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── BOOK SPINE ── */}
              <div className="w-[20px] shrink-0 relative z-30">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-300/30 to-transparent"></div>
                {/* Spine center line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gray-300/60"></div>
              </div>

              {/* ── RIGHT PAGE: Writing Canvas ── */}
              <div className="flex-1 flex flex-col relative bg-[#FFFCF6]">
                
                {/* Canvas Header / Toolbar */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white relative z-30">
                  <h3 className="font-bold text-[15px] text-gray-800">Latihan Menulis Berangkai</h3>
                  
                  <div className="flex items-center gap-4 bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-100">
                    {/* Colors */}
                    <div className="flex gap-1.5">
                      <button onClick={() => setBrushColor("#111827")} className={`w-5 h-5 rounded-full bg-gray-900 border-2 shadow-sm transition-transform hover:scale-110 ${brushColor === "#111827" ? 'ring-2 ring-[#1885A4] border-white' : 'border-transparent'}`}></button>
                      <button onClick={() => setBrushColor("#0F766E")} className={`w-5 h-5 rounded-full bg-teal-700 border-2 shadow-sm transition-transform hover:scale-110 ${brushColor === "#0F766E" ? 'ring-2 ring-[#1885A4] border-white' : 'border-transparent'}`}></button>
                      <button onClick={() => setBrushColor("#991B1B")} className={`w-5 h-5 rounded-full bg-red-800 border-2 shadow-sm transition-transform hover:scale-110 ${brushColor === "#991B1B" ? 'ring-2 ring-[#1885A4] border-white' : 'border-transparent'}`}></button>
                      <button onClick={() => setBrushColor("#F59E0B")} className={`w-5 h-5 rounded-full bg-amber-500 border-2 shadow-sm transition-transform hover:scale-110 ${brushColor === "#F59E0B" ? 'ring-2 ring-[#1885A4] border-white' : 'border-transparent'}`}></button>
                    </div>
                    <div className="w-px h-5 bg-gray-200"></div>
                    
                    {/* Brush Size */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Tebal</span>
                      <input 
                        type="range" min="10" max="60" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-14 accent-[#1885A4] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                    <div className="w-px h-5 bg-gray-200"></div>
                    
                    {/* Tools */}
                    <div className="flex gap-1">
                      <button onClick={clearCanvas} title="Hapus Kanvas" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notebook Paper + Drawing Canvas */}
                <div className="flex-1 relative overflow-hidden"
                     style={{
                       backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #e8e5df 39px, #e8e5df 40px)',
                       backgroundPosition: '0 20px'
                     }}>
                  
                  {/* Left margin red line (like a real notebook) */}
                  <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-red-200/40 z-10 pointer-events-none"></div>

                  {/* Large Letter Trace Guideline (Background) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="text-[340px] font-arabic text-gray-300/30 font-bold leading-none select-none">
                      {activeDef?.char || "ا"}
                    </span>
                  </div>

                  {/* INTERACTIVE HTML5 CANVAS */}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                    className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none"
                    style={{ touchAction: 'none' }} // Prevent scrolling on touch
                  />

                  {/* Check Action Button */}
                  <div className="absolute bottom-6 left-6 right-6 z-30 flex justify-end">
                    <button 
                      onClick={evaluateDrawing}
                      disabled={isEvaluating}
                      className="px-6 py-3 bg-[#1885A4] hover:bg-[#146e87] text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
                    >
                      {isEvaluating ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengevaluasi...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                          Periksa Tulisan
                        </>
                      )}
                    </button>
                  </div>

                  {/* Evaluation Result Modal Popup Overlay */}
                  {evalResult && (
                    <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                      <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-8 max-w-sm w-full text-center border border-gray-100 transform transition-all scale-100">
                        <div className="mb-4 relative mx-auto w-24 h-24">
                          {/* Circle Progress */}
                          <svg viewBox="0 0 36 36" className="w-24 h-24 stroke-[#1885A4] drop-shadow-md">
                            <path
                              className="text-gray-100"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={`${evalResult.score > 80 ? 'text-emerald-500' : (evalResult.score < 50 ? 'text-red-500' : 'text-[#1885A4]')} transition-all duration-1000 ease-out`}
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={`${evalResult.score}, 100`}
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-2xl font-black text-gray-800">{evalResult.score}</span>
                          </div>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                          {evalResult.score >= 90 ? "Luar Biasa!" : evalResult.score >= 75 ? "Bagus Sekali!" : evalResult.score >= 50 ? "Lumayan!" : "Oh tidak!"}
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6">
                          {evalResult.message}
                        </p>
                        
                        <div className="flex gap-3">
                          <button onClick={clearCanvas} className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                            Coba Lagi
                          </button>
                          <button onClick={() => setEvalResult(null)} className="flex-1 py-2.5 bg-[#1885A4] hover:bg-[#146e87] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#1885A4]/30">
                            Lanjut
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Page Curl */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none z-30">
                    <div className="absolute bottom-0 right-0 w-14 h-14 bg-[#f5f0e6] shadow-[-4px_-4px_12px_rgba(0,0,0,0.06)] transform rounded-tl-2xl z-20"></div>
                    <div className="absolute bottom-0 right-0 w-14 h-14 bg-gradient-to-tl from-gray-100 to-transparent rounded-tl-2xl opacity-40 z-10"></div>
                  </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center items-center gap-2 py-3 bg-white border-t border-gray-100 z-30">
                  <div className="w-2 h-2 rounded-full bg-[#1885A4]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <button className="ml-2 text-gray-400 hover:text-[#1885A4] transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* ═══════ RIGHT SIDEBAR: Tips & Detail ═══════ */}
            <div className="w-[260px] shrink-0 flex flex-col gap-5">
              
              {/* Tips Card */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden flex-1 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2 text-[15px]">
                  <span className="w-6 h-6 rounded-full bg-[#1885A4]/10 flex items-center justify-center text-xs">💡</span>
                  Tips Menulis Kata
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1885A4] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</div>
                    <p className="text-[12px] text-gray-600 leading-relaxed">Tulis huruf Arab <span className="font-bold text-gray-800">dari kanan ke kiri</span>, mulai dari titik awal yang benar.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1885A4] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</div>
                    <p className="text-[12px] text-gray-600 leading-relaxed">Perhatikan <span className="font-bold text-gray-800">proporsi</span> huruf — ikuti garis abu-abu besar di papan.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1885A4] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</div>
                    <p className="text-[12px] text-gray-600 leading-relaxed">Jangan lupa <span className="font-bold text-gray-800">titik-titik</span> pada huruf yang membutuhkannya.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#1885A4] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</div>
                    <p className="text-[12px] text-gray-600 leading-relaxed">Klik <span className="font-bold text-gray-800">Periksa Tulisan</span> saat Anda merasa coretan Anda sudah mirip.</p>
                  </div>
                </div>
              </div>

              {/* Detail Kata & Makna Card */}
              <div className="bg-[#1885A4]/5 rounded-2xl p-5 border border-[#1885A4]/15 shrink-0">
                <h3 className="font-bold text-gray-800 mb-4 text-[15px] border-b border-[#1885A4]/10 pb-2">Detail Kata & Makna</h3>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-xl font-bold font-arabic text-[#1885A4] shadow-sm shrink-0 border border-[#1885A4]/20">
                    {activeDef?.char || "ا"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none mb-1 text-[14px]">Huruf {activeDef?.name || "Alif"}</h4>
                    <p className="text-[11px] text-gray-500 italic">&quot;{activeDef?.name || "Alif"} ( {activeDef?.char || "ا"} )&quot; /&apos;{activeDef?.name || "Alif"}&apos;/</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Huruf pertama dalam abjad Arab. Mewakili suara &apos;a&apos;, &apos;i&apos;, &apos;u&apos;. Berlatih menulis huruf tunggal ini untuk dasar yang kuat. Tracing akan membantu memahami proporsi dan titik awal yang benar.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}
