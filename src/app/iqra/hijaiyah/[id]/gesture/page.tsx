"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const hijaiyahData: Record<string, { char: string, name: string }> = {
  "alif": { char: "ا", name: "Alif" },
  "baa": { char: "ب", name: "Ba" },
  "ta": { char: "ت", name: "Ta" },
};

export default function GestureRecognitionPage() {
  const params = useParams();
  const id = params.id as string;
  const letter = hijaiyahData[id];

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null)  // States for AI Processing
  type ScanState = "loading_model" | "tracking" | "success";
  const [scanState, setScanState] = useState<ScanState>("loading_model");
  const scanStateRef = useRef<ScanState>("loading_model");

  // MediaPipe Refs
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  
  // Custom hook pattern to keep ref in sync
  useEffect(() => {
    scanStateRef.current = scanState;
  }, [scanState]);

  const initMediaPipe = useCallback(async () => {
    try {
      setScanState("loading_model");
      
      const loadScript = (src: string) => {
        return new Promise<void>((resolve, reject) => {
          if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
          }
          const script = document.createElement("script");
          script.src = src;
          script.crossOrigin = "anonymous";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
          document.body.appendChild(script);
        });
      };

      // Load MediaPipe scripts from CDN
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

      const win = window as any;
      const Hands = win.Hands;
      const Camera = win.Camera;
      const drawConnectors = win.drawConnectors;
      const drawLandmarks = win.drawLandmarks;
      const HAND_CONNECTIONS = win.HAND_CONNECTIONS;

      if (!Hands || !Camera) {
        throw new Error("Library MediaPipe gagal diinisialisasi dari CDN");
      }

      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7
      });

      hands.onResults((results: any) => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) return;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (canvasRef.current.width !== videoRef.current.videoWidth && videoRef.current.videoWidth > 0) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }

        // Draw Hands and Check Gesture ALWAYS
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          for (const landmarks of results.multiHandLandmarks) {
            
            // Lakukan pengecekan gestur secara real-time kapanpun ada tangan
            if (scanStateRef.current === "tracking") {
              checkGesture(id, landmarks);
            }

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                           {color: '#1885A4', lineWidth: 4});
            drawLandmarks(canvasCtx, landmarks, {color: '#10B981', lineWidth: 2, radius: 4});
          }
        }
        canvasCtx.restore();
      });

      handsRef.current = hands;

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsRef.current) {
              await handsRef.current.send({image: videoRef.current});
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
        cameraRef.current = camera;
      }
      
      // Begitu model dimuat, langsung masuk mode pelacakan (tracking)
      setScanState("tracking");
    } catch (err) {
      console.error("Gagal memuat model MediaPipe:", err);
      setCameraError("Gagal memuat AI Deteksi Tangan.");
    }
  }, [id]);

  useEffect(() => {
    initMediaPipe();

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, [initMediaPipe]);

  // Gesture Recognition Logic
  const checkGesture = (letterId: string, landmarks: any[]) => {
    // Toleransi agar pendeteksian tidak terlalu kaku
    const indexUp = landmarks[8].y < landmarks[6].y && landmarks[6].y < landmarks[5].y;
    const middleUp = landmarks[12].y < landmarks[10].y;
    const ringUp = landmarks[16].y < landmarks[14].y;
    
    // Jari yang mengepal ujungnya harus berada di bawah pangkal ruas ke-2 (PIP)
    const middleFolded = landmarks[12].y > landmarks[10].y;
    const ringFolded = landmarks[16].y > landmarks[14].y;
    const pinkyFolded = landmarks[20].y > landmarks[18].y;

    let isMatch = false;

    if (letterId === "alif") {
      isMatch = indexUp && middleFolded && ringFolded && pinkyFolded;
    } else if (letterId === "baa") {
      isMatch = indexUp && middleUp && ringFolded && pinkyFolded;
    } else if (letterId === "ta") {
      isMatch = indexUp && middleUp && ringUp && pinkyFolded;
    }

    if (isMatch) {
      setScanState("success");
      // Kunci state di 'success' selama 2 detik sebelum mereset agar user bisa melihat feedback-nya
      setTimeout(() => setScanState("tracking"), 2000); 
    }
  };

  if (!letter) {
    return (
      <div className="flex h-screen w-full bg-[#FAF8F1] items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Huruf tidak ditemukan.</h1>
          <Link href="/iqra/hijaiyah" className="text-[#1885A4] hover:underline font-medium">Kembali ke Daftar Huruf</Link>
        </div>
      </div>
    );
  }

  // Get dynamic instructions based on letter
  const getInstruction = () => {
    if (id === "alif") return "Tegakkan jari telunjuk ke atas (angka 1), kepalkan jari lainnya.";
    if (id === "baa") return "Tegakkan jari telunjuk dan tengah (angka 2 / Peace), kepalkan jari lainnya.";
    if (id === "ta") return "Tegakkan jari telunjuk, tengah, dan manis (angka 3), kepalkan jari kelingking.";
    return "Posisikan tangan Anda dengan benar.";
  };

  return (
    <div className="flex h-screen w-full bg-[#FAF8F1] overflow-hidden font-sans relative">
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex items-center justify-between z-10 shrink-0">
          <Link href={`/iqra/hijaiyah/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1885A4] transition-colors w-fit group">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#1885A4] group-hover:border-[#1885A4] transition-colors shadow-sm">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </div>
            Kembali ke Audio AI
          </Link>

          <div className="flex items-center gap-3 bg-white px-5 py-2 rounded-full shadow-sm border border-gray-100">
            <svg className="w-5 h-5 text-[#1885A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <span className="text-sm font-bold text-gray-700">MediaPipe AI (Tunarungu)</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row p-8 gap-8 overflow-y-auto">
          
          {/* LEFT: Camera View */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            
            <div className="relative w-full max-w-2xl aspect-[4/3] rounded-[2rem] bg-gray-900 overflow-hidden shadow-2xl border-4 border-white">
              
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white p-8 text-center bg-gray-800">
                  <p>{cameraError}</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                    playsInline
                  />
                  <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-10"
                  />
                  
                  {/* Prominent Loading Overlay */}
                  {scanState === "loading_model" && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-900/70 backdrop-blur-md text-white transition-opacity duration-300">
                      <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-amber-400 border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black tracking-widest text-amber-400 mb-2 uppercase">Memuat Model AI</h3>
                      <p className="text-gray-300 text-sm font-medium animate-pulse">Menyiapkan sensor pelacak jari pintar...</p>
                    </div>
                  )}
                </>
              )}

              {/* Camera Overlays */}
              {!cameraError && (
                <>
                  {/* Bounding Box Guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className={`w-64 h-80 border-4 border-dashed rounded-3xl transition-colors duration-500 relative ${
                      scanState === "loading_model" ? "border-amber-400 animate-pulse" :
                      scanState === "tracking" ? "border-[#1885A4] bg-[#1885A4]/5" : 
                      "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] bg-emerald-500/20 backdrop-blur-sm"
                    }`}>
                      
                      {/* Success Checkmark overlay */}
                      {scanState === "success" && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-[1.25rem]">
                          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Status Badge */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className={`backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-mono font-bold tracking-widest uppercase flex items-center gap-3 shadow-xl transition-colors duration-300 ${
                      scanState === "success" ? "bg-emerald-500 scale-110" : "bg-black/60"
                    }`}>
                      {scanState === "loading_model" && <><span className="w-3 h-3 rounded-full bg-amber-400 animate-spin"></span> MEMUAT AI...</>}
                      {scanState === "tracking" && <><span className="w-3 h-3 rounded-full bg-[#1885A4] animate-ping"></span> MENDETEKSI REAL-TIME...</>}
                      {scanState === "success" && <><span className="w-3 h-3 rounded-full bg-white"></span> BENAR!</>}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Guide & References */}
          <div className="w-full md:w-96 flex flex-col gap-6">
            
            {/* Target Letter Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <span className="font-arabic font-bold text-9xl text-gray-800 leading-none mb-2">
                {letter.char}
              </span>
              <h3 className="text-2xl font-black text-[#1885A4] uppercase tracking-widest">
                {letter.name}
              </h3>
            </div>

            {/* Instruction Card */}
            <div className="bg-[#1885A4]/5 rounded-3xl p-6 border border-[#1885A4]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24 text-[#1885A4]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 relative z-10">
                <svg className="w-5 h-5 text-[#1885A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Panduan Isyarat
              </h4>
              
              <div className="bg-white rounded-2xl aspect-[4/3] mb-4 flex items-center justify-center p-2 border border-white shadow-sm relative overflow-hidden z-10 text-center">
                {id === "alif" ? (
                  <img src="/handsign/alif.jpeg" alt="Panduan Alif" className="w-full h-full object-contain rounded-xl" />
                ) : id === "baa" ? (
                  <img src="/handsign/baa.png" alt="Panduan Baa" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <span className="text-5xl font-bold text-[#1885A4]">
                    {id === "ta" && "🤟"}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed relative z-10">
                Untuk huruf <strong>{letter.name}</strong>, posisikan tangan Anda di depan layar. {getInstruction()} Klik tombol di bawah kamera, dan AI akan mencocokkannya secara otomatis!
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
