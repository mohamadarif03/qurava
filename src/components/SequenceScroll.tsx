"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

const TOTAL_FRAMES = 80;
const PRELOAD_BATCH_SIZE = 15; // Load first 15 frames immediately

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderRequested = useRef<boolean>(false);
  const currentFrameIndex = useRef<number>(0);

  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Motion hooks to track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Text Animations based on Scroll Progress (Mapped to complete before 80% scroll)
  // Phase 1 (0% - 40%) - Visible from the very beginning (opacity 1 at 0)
  const phase1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.4, 1], [1, 1, 1, 0, 0]);
  const phase1Y = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.4, 1], [24, 0, 0, -24, -24]);

  // Phase 2 (40% - 70%)
  const phase2Opacity = useTransform(scrollYProgress, [0, 0.39, 0.4, 0.45, 0.65, 0.7, 1], [0, 0, 0, 1, 1, 0, 0]);
  const phase2Y = useTransform(scrollYProgress, [0, 0.39, 0.4, 0.45, 0.65, 0.7, 1], [24, 24, 24, 0, 0, -24, -24]);

  // Phase 3 (70% - 100%)
  const phase3Opacity = useTransform(scrollYProgress, [0, 0.69, 0.7, 0.8, 1], [0, 0, 0, 1, 1]);
  const phase3Y = useTransform(scrollYProgress, [0, 0.69, 0.7, 0.8, 1], [24, 24, 24, 0, 0]);

  // Check mobile viewport and reduced motion preference
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      window.removeEventListener("resize", checkViewport);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Preloading image sequence
  useEffect(() => {
    if (prefersReducedMotion) {
      setLoading(false);
      return;
    }

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const getFrameUrl = (index: number) => {
      const padded = String(index).padStart(3, "0");
      return `/sequence/Quran_opening_with_light_202607310822_${padded}.jpg`;
    };

    // Load a single frame and return a promise
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (images[index]) {
          resolve(images[index]);
          return;
        }

        const img = new Image();
        img.src = getFrameUrl(index);
        img.onload = () => {
          images[index] = img;
          resolve(img);
        };
        img.onerror = () => {
          // Fallback
          img.src = `/sequence/Quran_opening_with_light_202607310822_${String(index).padStart(3, "0")}.jpg`;
          img.onload = () => {
            images[index] = img;
            resolve(img);
          };
          img.onerror = () => reject();
        };
      });
    };

    const startLoading = async () => {
      try {
        // Step 1: Preload the first batch (0 to PRELOAD_BATCH_SIZE - 1) immediately
        const initialPromises = [];
        for (let i = 0; i < PRELOAD_BATCH_SIZE; i++) {
          initialPromises.push(loadFrame(i));
        }
        await Promise.all(initialPromises);
        
        // Render first frame immediately once first batch is ready (frame 0)
        imagesRef.current = images;
        setLoading(false);
        renderFrame(0);

        // Step 2: Load the rest progressively in the background
        const remainingFrames = [];
        for (let i = PRELOAD_BATCH_SIZE; i < TOTAL_FRAMES; i++) {
          remainingFrames.push(i);
        }

        // Chunk background loads to prevent network choking
        const chunkSize = 10;
        for (let i = 0; i < remainingFrames.length; i += chunkSize) {
          const chunk = remainingFrames.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map(async (frameIdx) => {
              try {
                await loadFrame(frameIdx);
                loadedCount++;
                const progress = Math.min(
                  95,
                  Math.round((loadedCount / (TOTAL_FRAMES - PRELOAD_BATCH_SIZE)) * 100)
                );
                setLoadProgress(progress);
              } catch (e) {
                console.error(`Failed to load frame ${frameIdx}`, e);
              }
            })
          );
        }

        setLoadProgress(100);
      } catch (err) {
        console.error("Error preloading sequence:", err);
      }
    };

    startLoading();
  }, [prefersReducedMotion]);

  // Render function using Canvas
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    
    // Resize canvas based on client rect to ensure sharpness
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * devicePixelRatio || canvas.height !== height * devicePixelRatio) {
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    ctx.clearRect(0, 0, width, height);

    // Cover algorithm targeting center-right for desktop and centered/scaled for mobile
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      
      // On desktop and mobile, keep it centered as requested
      offsetX = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    renderRequested.current = false;
  };

  // Update canvas on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (loading || prefersReducedMotion) return;

    // The first 65% of scroll progress drives the animation.
    // The remaining 35% creates a "pause" effect before the next section covers it.
    const animationLimit = 0.65;
    const progress = Math.min(1, latest / animationLimit);

    const frameIndex = Math.min(
      TOTAL_FRAMES - 1,
      Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
    );

    if (frameIndex !== currentFrameIndex.current) {
      currentFrameIndex.current = frameIndex;

      if (!renderRequested.current) {
        renderRequested.current = true;
        requestAnimationFrame(() => {
          renderFrame(frameIndex);
        });
      }
    }
  });

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (!loading && !prefersReducedMotion) {
        renderFrame(currentFrameIndex.current || 0);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loading, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#FAF8F1]"
      style={{
        height: isMobile ? "500vh" : "900vh",
        backgroundImage: `linear-gradient(135deg, #FFFDF8 0%, #FAF8F1 45%, #F3F0E6 100%)`,
      }}
    >
      {/* Pinned Sticky Section */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Loading UI */}
        {loading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F1]">
            <div className="flex flex-col items-center gap-4 max-w-xs text-center">
              <span className="text-sm font-medium tracking-wide text-[#1885A4]">
                Menyiapkan pengalaman membaca...
              </span>
              <div className="w-48 h-1 bg-[#E7D8AF] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#136b85] transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(5, loadProgress)}%` }}
                />
              </div>
              <span className="text-xs text-[#7D8D86] font-mono">
                {loadProgress}%
              </span>
            </div>
          </div>
        )}

        {/* Canvas Render Frame */}
        {!prefersReducedMotion ? (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none block z-0"
          />
        ) : (
          /* Reduced Motion Fallback Static State */
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(/sequence/Quran_opening_with_light_202607310822_079.jpg)`,
              backgroundPosition: isMobile ? "center" : "75% center",
            }}
          />
        )}

        {/* Cinematic Mihrab Ambient Overlay (Architectural Depth Accent) */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-10 opacity-40 mix-blend-multiply" />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col px-6 md:px-12 lg:px-16 pt-32 pb-12 md:pb-16 lg:pb-24">
          <div className="w-full h-full flex flex-col select-none">
            
            {/* Dynamic Scrollytelling content block */}
            {!prefersReducedMotion ? (
              <div className="relative w-full h-full flex flex-col">
                {/* Phase 1 */}
                <motion.div
                  style={{ opacity: phase1Opacity, y: phase1Y, pointerEvents: "none" }}
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Center Top Pills Removed */}
                  <div className="absolute inset-0 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                      {/* Left Side: Bold Title & Text */}
                      <div className="max-w-md pointer-events-auto mt-20">
                        <h1 className="text-5xl md:text-6xl font-sans font-black text-[#FFFDF8] leading-[1.0] tracking-tight mb-6 uppercase drop-shadow-md">
                          Belajar<br />Lebih<br />Inklusif
                        </h1>
                        <p className="text-sm md:text-[15px] text-[#FFFDF8]/90 leading-relaxed font-sans font-normal border-l-2 border-[#136b85] pl-4">
                          Setiap insan berhak merasakan keindahan ayat suci. Kami hadir dengan fitur khusus yang ramah disabilitas, dari audio jernih hingga teks disleksia.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="absolute bottom-0 left-0 w-full flex items-end justify-between pointer-events-auto pb-4">
                    {/* Socials (Removed) */}
                    <div className="w-24"></div>
                    {/* Center Text */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-[1px] bg-[#FFFDF8]/30"></div>
                      <span className="text-[#FFFDF8] text-sm font-medium uppercase tracking-wider">Mulai Menjelajah</span>
                      <div className="w-12 h-[1px] bg-[#FFFDF8]/30"></div>
                    </div>
                    {/* Right Button */}
                    <a href="#fitur" className="px-6 py-2 bg-[#FFFDF8] text-[#1885A4] rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-2">
                      Fitur Lainnya <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>
                </motion.div>

                {/* Phase 2 */}
                <motion.div
                  style={{ opacity: phase2Opacity, y: phase2Y, pointerEvents: "none" }}
                  className="absolute inset-0 flex flex-col items-end justify-center ml-auto text-right max-w-lg mt-20"
                >
                  <div className="p-8">
                    <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#FFFDF8] mb-4 bg-[#FFFDF8]/20 px-4 py-1.5 rounded-full border border-[#FFFDF8]/30 inline-block drop-shadow-sm">
                      Fitur Pendukung
                    </span>
                    <h1 className="text-5xl md:text-6xl font-sans font-black text-[#FFFDF8] leading-[1.0] tracking-tight mb-6 uppercase drop-shadow-md">
                      Sentuhan,<br />Suara, dan<br />Visual
                    </h1>
                    <p className="text-sm md:text-[15px] text-[#FFFDF8]/90 leading-relaxed font-sans font-normal border-r-2 border-[#136b85] pr-4">
                      Dari audio yang jernih, bahasa isyarat responsif, hingga teks ramah disleksia, temukan kemudahan dalam setiap hurufnya.
                    </p>
                  </div>
                </motion.div>

                {/* Phase 3 */}
                <motion.div
                  style={{ opacity: phase3Opacity, y: phase3Y }}
                  className="absolute inset-0 flex flex-col items-start justify-center text-left max-w-lg pointer-events-auto mt-20"
                >
                  <div className="p-8">
                    <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#FFFDF8] mb-4 bg-[#FFFDF8]/20 px-4 py-1.5 rounded-full border border-[#FFFDF8]/30 inline-block drop-shadow-sm">
                      Mari Memulai
                    </span>
                    <h1 className="text-5xl md:text-6xl font-sans font-black text-[#FFFDF8] leading-[1.0] tracking-tight mb-6 uppercase drop-shadow-md">
                      Satu Langkah<br />Nyata Menuju<br />Kebaikan
                    </h1>
                    <p className="text-sm md:text-[15px] text-[#FFFDF8]/90 leading-relaxed font-sans font-normal border-l-2 border-[#136b85] pl-4 mb-8">
                      Mari mulai perjalanan spiritual Anda. Temukan surah yang ingin Anda baca dan rasakan kenyamanannya sekarang.
                    </p>

                    <Link
                      href="/dashboard"
                      className="group flex items-center gap-4 bg-[#FFFDF8] hover:bg-gray-100 text-[#1885A4] px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 w-fit"
                    >
                      <span className="font-sans font-black text-sm tracking-[0.1em] uppercase">
                        Mulai Belajar
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#1885A4]/10 flex items-center justify-center group-hover:bg-[#1885A4]/20 transition-colors">
                        <svg className="w-4 h-4 text-[#1885A4] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Simple Static Layout for Accessibility & Reduced Motion */
              <div className="w-full h-full relative">
                {/* Center Top Pills */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  <button className="px-6 py-2 bg-[#FFFDF8] text-[#1885A4] rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105">
                    Fitur
                  </button>
                  <button className="px-6 py-2 bg-[#FFFDF8]/20 backdrop-blur-sm text-[#FFFDF8] rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105">
                    Tentang
                  </button>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row justify-between items-center w-full">
                    {/* Left Side: Bold Title & Text */}
                    <div className="max-w-md mt-20">
                      <h1 className="text-5xl md:text-6xl font-sans font-black text-[#FFFDF8] leading-[1.0] tracking-tight mb-6 uppercase drop-shadow-md">
                        Belajar<br />Lebih<br />Inklusif
                      </h1>
                      <p className="text-sm md:text-[15px] text-[#FFFDF8]/90 leading-relaxed font-sans font-normal border-l-2 border-[#136b85] pl-4">
                        Setiap insan berhak merasakan keindahan ayat suci. Kami hadir dengan fitur khusus yang ramah disabilitas, dari audio jernih hingga teks disleksia.
                      </p>
                    </div>

                    {/* Right Side: Selectors */}
                    <div className="hidden lg:flex flex-col items-center mt-20">
                      <span className="text-[#FFFDF8] text-sm font-medium mb-4">Pilih Mode</span>
                      <div className="flex gap-4 mb-6">
                        <button className="w-10 h-10 rounded-full bg-[#136b85] border-2 border-white shadow-lg transition-transform hover:scale-110" title="Standar"></button>
                        <button className="w-10 h-10 rounded-full bg-[#f97316] border-2 border-transparent hover:border-white shadow-lg transition-transform hover:scale-110" title="Audio"></button>
                        <button className="w-10 h-10 rounded-full bg-[#e11d48] border-2 border-transparent hover:border-white shadow-lg transition-transform hover:scale-110" title="Disleksia"></button>
                      </div>
                      <div className="flex gap-4">
                        <button className="w-10 h-10 rounded-full border border-[#FFFDF8]/50 text-[#FFFDF8] flex items-center justify-center text-xs hover:bg-[#FFFDF8]/10 transition-colors">Aa</button>
                        <button className="w-10 h-10 rounded-full border border-[#FFFDF8]/50 text-[#FFFDF8] flex items-center justify-center text-sm font-bold hover:bg-[#FFFDF8]/10 transition-colors">Aa</button>
                        <button className="w-10 h-10 rounded-full border border-[#FFFDF8]/50 text-[#FFFDF8] flex items-center justify-center text-base font-bold hover:bg-[#FFFDF8]/10 transition-colors">Aa</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-0 left-0 w-full flex items-end justify-between pb-4">
                  {/* Socials */}
                  <div className="flex gap-6">
                    <a href="#" className="text-[#FFFDF8] hover:text-[#136b85] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                    <a href="#" className="text-[#FFFDF8] hover:text-[#136b85] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
                  </div>
                  {/* Center Text */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-[1px] bg-[#FFFDF8]/30"></div>
                    <span className="text-[#FFFDF8] text-sm font-medium uppercase tracking-wider">Mulai Menjelajah</span>
                    <div className="w-12 h-[1px] bg-[#FFFDF8]/30"></div>
                  </div>
                  {/* Right Button */}
                  <a href="#fitur" className="px-6 py-2 bg-[#FFFDF8] text-[#1885A4] rounded-full font-bold text-sm shadow-md transition-transform hover:scale-105 flex items-center gap-2">
                    Fitur Lainnya <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
