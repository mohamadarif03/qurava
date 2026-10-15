"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { classifyLandmarks, loadHandsignModel, type Landmark } from "@/services/handsign-service";

const hijaiyahData: Record<string, { char: string; name: string }> = {
  "alif": { char: "ا", name: "Alif" },
  "baa": { char: "ب", name: "Ba" },
  "ta": { char: "ت", name: "Ta" },
  "tsa": { char: "ث", name: "Tsa" },
  "jim": { char: "ج", name: "Jim" },
  "ha1": { char: "ح", name: "Ha" },
  "kha": { char: "خ", name: "Kha" },
  "dal": { char: "د", name: "Dal" },
  "dzal": { char: "ذ", name: "Dzal" },
  "ra": { char: "ر", name: "Ra" },
  "zai": { char: "ز", name: "Zai" },
  "sin": { char: "س", name: "Sin" },
  "syin": { char: "ش", name: "Syin" },
  "shad": { char: "ص", name: "Shad" },
  "dhad": { char: "ض", name: "Dhad" },
  "tha": { char: "ط", name: "Tha" },
  "zha": { char: "ظ", name: "Zha" },
  "ain": { char: "ع", name: "Ain" },
  "ghain": { char: "غ", name: "Ghain" },
  "fa": { char: "ف", name: "Fa" },
  "qaf": { char: "ق", name: "Qaf" },
  "kaf": { char: "ك", name: "Kaf" },
  "lam": { char: "ل", name: "Lam" },
  "mim": { char: "م", name: "Mim" },
  "nun": { char: "ن", name: "Nun" },
  "waw": { char: "و", name: "Waw" },
  "ha2": { char: "ه", name: "Ha" },
  "ya": { char: "ي", name: "Ya" },
};

const labelInfo: Record<string, { char: string; name: string }> = {
  alif: { char: "ا", name: "Alif" },
  ba: { char: "ب", name: "Ba" },
  ta: { char: "ت", name: "Ta" },
  tsa: { char: "ث", name: "Tsa" },
  jim: { char: "ج", name: "Jim" },
  ha: { char: "ح", name: "Ha" },
  kha: { char: "خ", name: "Kha" },
  dal: { char: "د", name: "Dal" },
  dzal: { char: "ذ", name: "Dzal" },
  ra: { char: "ر", name: "Ra" },
  zai: { char: "ز", name: "Zai" },
  sin: { char: "س", name: "Sin" },
  syin: { char: "ش", name: "Syin" },
  shad: { char: "ص", name: "Shad" },
  dhad: { char: "ض", name: "Dhad" },
  tha: { char: "ط", name: "Tha" },
  zha: { char: "ظ", name: "Zha" },
  ain: { char: "ع", name: "Ain" },
  ghain: { char: "غ", name: "Ghain" },
  fa: { char: "ف", name: "Fa" },
  qaf: { char: "ق", name: "Qaf" },
  kaf: { char: "ك", name: "Kaf" },
  lam: { char: "ل", name: "Lam" },
  mim: { char: "م", name: "Mim" },
  nun: { char: "ن", name: "Nun" },
  waw: { char: "و", name: "Waw" },
  ya: { char: "ي", name: "Ya" },
};

type ScanState = "loading_model" | "tracking" | "success";

type HandsResults = {
  multiHandLandmarks?: Landmark[][];
};

type HandsApi = {
  setOptions: (options: {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }) => void;
  onResults: (callback: (results: HandsResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void;
};

type CameraApi = {
  start: () => void | Promise<void>;
  stop: () => void;
};

type MediaPipeWindow = Window & {
  Hands?: new (options: { locateFile: (file: string) => string }) => HandsApi;
  Camera?: new (
    video: HTMLVideoElement,
    options: { onFrame: () => Promise<void>; width: number; height: number },
  ) => CameraApi;
  drawConnectors?: (
    context: CanvasRenderingContext2D,
    landmarks: Landmark[],
    connections: unknown,
    style: { color: string; lineWidth: number },
  ) => void;
  drawLandmarks?: (
    context: CanvasRenderingContext2D,
    landmarks: Landmark[],
    style: { color: string; lineWidth: number; radius: number },
  ) => void;
  HAND_CONNECTIONS?: unknown;
};

export default function GestureRecognitionPage() {
  const params = useParams();
  const id = params.id as string;
  const letter = hijaiyahData[id];

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanState, setScanState] = useState<ScanState>("loading_model");
  const scanStateRef = useRef<ScanState>("loading_model");
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  const idRef = useRef(id);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const lastClassificationRef = useRef(0);
  const isClassifyingRef = useRef(false);
  const mountedRef = useRef(true);

  const handsRef = useRef<HandsApi | null>(null);
  const cameraRef = useRef<CameraApi | null>(null);
  
  // Custom hook pattern to keep ref in sync
  useEffect(() => {
    scanStateRef.current = scanState;
  }, [scanState]);

  const initMediaPipe = useCallback(async () => {
    try {
      setScanState("loading_model");
      setCameraError(null);
      
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
      if (!mountedRef.current) return;

      const win = window as unknown as MediaPipeWindow;
      const Hands = win.Hands;
      const Camera = win.Camera;
      const drawConnectors = win.drawConnectors;
      const drawLandmarks = win.drawLandmarks;
      const HAND_CONNECTIONS = win.HAND_CONNECTIONS;

      if (!Hands || !Camera || !drawConnectors || !drawLandmarks || !HAND_CONNECTIONS) {
        throw new Error("Library MediaPipe gagal diinisialisasi dari CDN");
      }

      await loadHandsignModel();
      if (!mountedRef.current) return;

      const hands = new Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 0,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      hands.onResults((results: HandsResults) => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) return;

        if (canvasRef.current.width !== videoRef.current.videoWidth && videoRef.current.videoWidth > 0) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }

        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          for (const landmarks of results.multiHandLandmarks) {
            const now = Date.now();
            
            // Fast 90ms real-time classification with concurrency lock
            if (!isClassifyingRef.current && now - lastClassificationRef.current >= 90) {
              lastClassificationRef.current = now;
              isClassifyingRef.current = true;
              
              classifyLandmarks(landmarks, idRef.current)
                .then((result) => {
                  if (!result || !mountedRef.current) return;

                  setDetectedLabel(result.label);
                  setConfidence(result.confidence);

                  if (result.correct) {
                    setScanState("success");
                  } else {
                    setScanState("tracking");
                  }
                })
                .catch((error: unknown) => {
                  console.error("Hand-sign classification failed:", error);
                })
                .finally(() => {
                  isClassifyingRef.current = false;
                });
            }

            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                           {color: '#1885A4', lineWidth: 4});
            drawLandmarks(canvasCtx, landmarks, {color: '#10B981', lineWidth: 2, radius: 4});
          }
        } else {
          // Hand not present in frame: reset values
          setDetectedLabel(null);
          setConfidence(null);
          if (scanStateRef.current === "success") {
            setScanState("tracking");
          }
        }
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
        Promise.resolve(camera.start()).catch((error: unknown) => {
          console.error(error);
          if (mountedRef.current) setCameraError("Izin kamera ditolak atau tidak tersedia.");
        });
        cameraRef.current = camera;
      }
      
      setScanState("tracking");
    } catch (err) {
      console.error("Gagal memuat model MediaPipe:", err);
      setCameraError("Gagal memuat AI Deteksi Tangan.");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const initTimeout = window.setTimeout(() => {
      void initMediaPipe();
    }, 0);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(initTimeout);
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, [initMediaPipe]);

  if (!letter) {
    return (
      <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] items-center justify-center px-4 font-sans text-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Huruf tidak ditemukan.</h1>
          <Link href="/iqra/hijaiyah" className="text-[#1885A4] hover:underline font-medium">Kembali ke Daftar Huruf</Link>
        </div>
      </div>
    );
  }

  // Get dynamic instructions based on letter
  const getInstruction = () => {
    if (id === "alif") return "Tegakkan jari telunjuk lurus ke atas (seperti angka 1), kepalkan jari-jari lainnya.";
    if (id === "baa") return "Tegakkan jari telunjuk dan jari tengah ke atas (seperti pose 2 jari / Peace), kepalkan jari lainnya.";
    if (id === "ta") return "Tegakkan jari telunjuk, tengah, dan manis ke atas (angka 3), kepalkan jari kelingking dan jempol.";
    if (id === "tsa") return "Buka telapak tangan menghadap kamera dengan jari rapat.";
    return `Tunjukkan gestur huruf ${letter.name} di depan kamera. Model AI akan mencocokkan bentuk tanganmu secara otomatis dan seketika.`;
  };

  // List of letters for quick switcher
  const hijaiyahList = Object.entries(hijaiyahData).map(([key, val]) => ({
    id: key,
    ...val,
  }));
  const currentIndex = hijaiyahList.findIndex((item) => item.id === id);
  const prevItem = currentIndex > 0 ? hijaiyahList[currentIndex - 1] : null;
  const nextItem = currentIndex < hijaiyahList.length - 1 ? hijaiyahList[currentIndex + 1] : null;

  const currentDetectedInfo = detectedLabel ? labelInfo[detectedLabel] : null;
  const isMatch = scanState === "success" || detectedLabel === id || (id === "baa" && detectedLabel === "ba");

  return (
    <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans relative">
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative z-10 pb-20 lg:pb-0">
        
        {/* Header */}
        <header className="px-4 pt-3 pb-2 sm:px-6 md:px-8 md:pt-6 md:pb-3 flex flex-col gap-2 z-10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <Link href={`/iqra/hijaiyah/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1885A4] transition-colors w-fit group">
              <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-[#1885A4] group-hover:border-[#1885A4] transition-colors shadow-sm">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
              </div>
              <span className="hidden sm:inline">Kembali ke Audio AI</span>
            </Link>

            {/* Quick Next/Prev Navigation */}
            <div className="flex items-center gap-2">
              {prevItem && (
                <Link
                  href={`/iqra/hijaiyah/${prevItem.id}/gesture`}
                  className="px-3 py-1.5 text-xs font-bold rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#1885A4] hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                  <span className="hidden sm:inline">{prevItem.name}</span>
                  <span className="font-arabic font-bold text-sm">{prevItem.char}</span>
                </Link>
              )}
              {nextItem && (
                <Link
                  href={`/iqra/hijaiyah/${nextItem.id}/gesture`}
                  className="px-3 py-1.5 text-xs font-bold rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-[#1885A4] hover:text-white transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span className="font-arabic font-bold text-sm">{nextItem.char}</span>
                  <span className="hidden sm:inline">{nextItem.name}</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-700">Real-time AI (410 KB)</span>
            </div>
          </div>

          {/* Quick Letter Switcher Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 custom-scrollbar max-w-full">
            {hijaiyahList.map((item) => {
              const active = item.id === id;
              return (
                <Link
                  key={item.id}
                  href={`/iqra/hijaiyah/${item.id}/gesture`}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    active
                      ? "bg-[#1885A4] text-white shadow-md scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                  }`}
                >
                  <span className="font-arabic text-sm leading-none font-bold">{item.char}</span>
                  <span className="text-[11px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col xl:flex-row p-3 sm:p-5 md:p-6 gap-4 md:gap-6 overflow-y-auto">
          
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
                    <div className={`w-[45%] min-w-36 max-w-64 h-[70%] min-h-44 max-h-80 border-2 sm:border-4 border-dashed rounded-2xl sm:rounded-3xl transition-colors duration-200 relative ${
                      scanState === "loading_model" ? "border-amber-400 animate-pulse" :
                      isMatch ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.6)] bg-emerald-500/20 backdrop-blur-[2px]" :
                      detectedLabel ? "border-amber-400/80 bg-amber-400/5" :
                      "border-[#1885A4] bg-[#1885A4]/5"
                    }`}>
                      
                      {/* Success Checkmark overlay */}
                      {isMatch && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-[1.25rem]">
                          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.8)]">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Status Badge */}
                  <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 z-20">
                    <div className={`whitespace-nowrap backdrop-blur-md text-white px-3 py-1.5 sm:px-6 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest uppercase flex items-center gap-2 sm:gap-3 shadow-xl transition-all duration-200 ${
                      isMatch ? "bg-emerald-600 scale-105" : "bg-black/70"
                    }`}>
                      {scanState === "loading_model" && <><span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-spin"></span> MEMUAT AI...</>}
                      {scanState !== "loading_model" && (
                        <>
                          <span className={`w-2.5 h-2.5 rounded-full ${isMatch ? "bg-white" : detectedLabel ? "bg-amber-400 animate-ping" : "bg-[#1885A4] animate-ping"}`}></span>
                          {isMatch ? "BENAR! COCOK 🎉" : detectedLabel ? `TERDETEKSI: ${(currentDetectedInfo?.name || detectedLabel).toUpperCase()}` : "MENDETEKSI REAL-TIME..."}
                        </>
                      )}
                    </div>
                  </div>

                  {/* FLOATING REAL-TIME DETECTION HUD */}
                  <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-md pointer-events-none">
                    <div className={`backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-white transition-all duration-200 border ${
                      isMatch
                        ? "bg-emerald-600/90 border-emerald-400/80 shadow-emerald-500/30"
                        : detectedLabel
                        ? "bg-gray-900/85 border-amber-400/50"
                        : "bg-gray-900/65 border-white/20"
                    }`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-arabic font-bold text-xl shrink-0 ${
                          isMatch ? "bg-white text-emerald-600" : detectedLabel ? "bg-amber-400 text-gray-900" : "bg-white/10 text-gray-400"
                        }`}>
                          {currentDetectedInfo?.char || "؟"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                            {detectedLabel ? "Terdeteksi Sekarang" : "Kamera Siap"}
                          </div>
                          <div className="text-sm font-black truncate">
                            {detectedLabel ? (
                              <span>
                                {currentDetectedInfo?.name || detectedLabel.toUpperCase()}
                                {isMatch && " • Cocok dengan target!"}
                              </span>
                            ) : (
                              <span className="text-gray-300 font-normal text-xs">Posisikan tangan di depan kamera</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-300">Keyakinan</div>
                        <div className={`text-base font-mono font-black ${
                          isMatch ? "text-white" : detectedLabel ? "text-amber-300" : "text-gray-400"
                        }`}>
                          {confidence !== null ? `${(confidence * 100).toFixed(0)}%` : "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                </>
              )}
            </div>
          </div>

          {/* RIGHT: Guide & References */}
          <div className="w-full xl:w-96 xl:shrink-0 grid grid-cols-1 md:grid-cols-2 xl:flex xl:flex-col gap-4 md:gap-5">
            
            {/* Target Letter Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Target Huruf</div>
              <span className="font-arabic font-bold text-8xl sm:text-9xl text-gray-800 leading-none mb-2">
                {letter.char}
              </span>
              <h3 className="text-2xl font-black text-[#1885A4] uppercase tracking-widest">
                {letter.name}
              </h3>
            </div>

            {/* Instruction Card */}
            <div className="bg-[#1885A4]/5 rounded-3xl p-5 sm:p-6 border border-[#1885A4]/10 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 relative z-10 text-sm">
                  <svg className="w-5 h-5 text-[#1885A4]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Panduan Isyarat
                </h4>
                
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed relative z-10">
                  Untuk huruf <strong>{letter.name}</strong>, {getInstruction()}
                </p>
              </div>

              {/* Real-time Result Box */}
              <div className="mt-4 rounded-2xl bg-white border border-gray-100 p-4 relative z-10 shadow-sm">
                <div className="flex items-center justify-between gap-3 text-xs mb-2">
                  <span className="font-bold text-gray-500">Hasil deteksi live:</span>
                  <span className={`font-black text-sm ${isMatch ? "text-emerald-600" : detectedLabel ? "text-[#1885A4]" : "text-gray-400"}`}>
                    {detectedLabel ? `${(currentDetectedInfo?.name || detectedLabel).toUpperCase()} (${currentDetectedInfo?.char || ""})` : "Menunggu..."}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-gray-500 mb-2">
                  <span>Keyakinan AI:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {confidence === null ? "—" : `${(confidence * 100).toFixed(0)}%`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-150 ${isMatch ? "bg-emerald-500" : "bg-[#1885A4]"}`}
                    style={{ width: `${confidence !== null ? Math.min(100, confidence * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
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
      `}} />
    </div>
  );
}
