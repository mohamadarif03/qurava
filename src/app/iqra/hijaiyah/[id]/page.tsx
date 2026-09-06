"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useRecorder } from "@/hooks/use-recorder";
import { transcribeAudio } from "@/services/audio-service";

type LetterData = {
  char: string;
  name: string;
  audio?: string;
  aliases: string[];
};

const hijaiyahData: Record<string, LetterData> = {
  "alif": { char: "ا", name: "Alif", audio: "/audio/hijaiyah/alif.mp3", aliases: ["alif", "الف", "ألف", "ا"] },
  "baa": { char: "ب", name: "Ba", audio: "/audio/hijaiyah/baa.mp3", aliases: ["ba", "baa", "باء", "ب"] },
  "ta": { char: "ت", name: "Ta", audio: "/audio/hijaiyah/ta.mp3", aliases: ["ta", "taa", "تاء", "ت"] },
  "tsa": { char: "ث", name: "Tsa", aliases: ["tsa", "tsaa", "ثاء", "ث"] },
  "jim": { char: "ج", name: "Jim", aliases: ["jim", "jiim", "جيم", "ج"] },
  "ha1": { char: "ح", name: "Ha", aliases: ["ha", "haa", "حاء", "ح"] },
  "kha": { char: "خ", name: "Kha", aliases: ["kha", "khaa", "خاء", "خ"] },
  "dal": { char: "د", name: "Dal", aliases: ["dal", "daal", "دال", "د"] },
  "dzal": { char: "ذ", name: "Dzal", aliases: ["dzal", "dhal", "dzaal", "ذال", "ذ"] },
  "ra": { char: "ر", name: "Ra", aliases: ["ra", "raa", "راء", "ر"] },
  "zai": { char: "ز", name: "Zai", aliases: ["zai", "zay", "zaay", "زاي", "ز"] },
  "sin": { char: "س", name: "Sin", aliases: ["sin", "siin", "سين", "س"] },
  "syin": { char: "ش", name: "Syin", aliases: ["syin", "shin", "shiin", "شين", "ش"] },
  "shad": { char: "ص", name: "Shad", aliases: ["shad", "saad", "صاد", "ص"] },
  "dhad": { char: "ض", name: "Dhad", aliases: ["dhad", "dhaad", "ضاد", "ض"] },
  "tha": { char: "ط", name: "Tha", aliases: ["tha", "thaa", "طاء", "ط"] },
  "zha": { char: "ظ", name: "Zha", aliases: ["zha", "zaa", "ظاء", "ظ"] },
  "ain": { char: "ع", name: "Ain", aliases: ["ain", "ayn", "عين", "ع"] },
  "ghain": { char: "غ", name: "Ghain", aliases: ["ghain", "ghayn", "غين", "غ"] },
  "fa": { char: "ف", name: "Fa", aliases: ["fa", "faa", "فاء", "ف"] },
  "qaf": { char: "ق", name: "Qaf", aliases: ["qaf", "qaaf", "قاف", "ق"] },
  "kaf": { char: "ك", name: "Kaf", aliases: ["kaf", "kaaf", "كاف", "ك"] },
  "lam": { char: "ل", name: "Lam", aliases: ["lam", "laam", "لام", "ل"] },
  "mim": { char: "م", name: "Mim", aliases: ["mim", "miim", "ميم", "م"] },
  "nun": { char: "ن", name: "Nun", aliases: ["nun", "nuun", "نون", "ن"] },
  "waw": { char: "و", name: "Waw", aliases: ["waw", "waaw", "واو", "و"] },
  "ha2": { char: "ه", name: "Ha", aliases: ["ha", "haa", "هاء", "ه"] },
  "ya": { char: "ي", name: "Ya", aliases: ["ya", "yaa", "ياء", "ي"] },
};

type SpeechResult = {
  correct: boolean;
  transcript?: string;
  error?: boolean;
};

const normalizeSpeech = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ً-ٟؐ-ؚٰ]/g, "")
    .replace(/[^\p{L}\p{N}\u0600-\u06ff]/gu, "");

const matchesSpeech = (transcript: string, aliases: string[]) => {
  const cleanTranscript = normalizeSpeech(transcript);
  if (!cleanTranscript) return false;
  return aliases.some((alias) => {
    const cleanAlias = normalizeSpeech(alias);
    return cleanTranscript.includes(cleanAlias) || cleanAlias.includes(cleanTranscript);
  });
};

const waveformHeights = [12, 20, 15, 28, 18, 24, 10, 22, 16, 26, 14, 19];

export default function HijaiyahDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const letter = hijaiyahData[id];

  // Base Audio States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecord, setIsPlayingRecord] = useState(false);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechResult | null>(null);
  const { isRecording, start, stop } = useRecorder();

  // Init base audio
  useEffect(() => {
    if (letter?.audio) {
      audioRef.current = new Audio(letter.audio);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [letter]);

  const toggleAudio = () => {
    if (!letter?.audio || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  const handleBlob = async (blob: Blob) => {
    if (!letter) return;

    if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    setRecordedAudioUrl(URL.createObjectURL(blob));
    setIsAnalyzing(true);
    setSpeechResult(null);

    try {
      const transcript = await transcribeAudio(blob);
      setSpeechResult({
        correct: matchesSpeech(transcript, letter.aliases),
        transcript,
      });
    } catch (error: unknown) {
      console.error("Speech recognition failed:", error);
      setSpeechResult({ correct: false, error: true });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = async () => {
    if (isAnalyzing) return;
    if (isRecording) {
      stop();
      return;
    }

    setSpeechResult(null);
    try {
      await start(handleBlob, 2_000);
    } catch (error: unknown) {
      console.error("Error accessing microphone:", error);
      setSpeechResult({ correct: false, error: true });
    }
  };

  const playRecordedAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecord && userAudioRef.current) {
      userAudioRef.current.pause();
      userAudioRef.current.currentTime = 0;
      setIsPlayingRecord(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    userAudioRef.current = audio;
    audio.onended = () => setIsPlayingRecord(false);
    audio.play();
    setIsPlayingRecord(true);
  };

  if (!letter) {
    return (
      <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] items-center justify-center px-4 font-sans text-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Huruf tidak ditemukan atau terkunci.</h1>
          <Link href="/iqra/hijaiyah" className="text-[#1885A4] hover:underline font-medium">Kembali ke Daftar Huruf</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans relative">
      
      {/* ═══════════════ BACKGROUND EFFECTS ═══════════════ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-[0.03] mix-blend-multiply flex items-center justify-center">
        <span className="font-arabic text-[800px] leading-none text-[#1885A4]">{letter.char}</span>
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1885A4]/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative z-10 pb-20 lg:pb-0">
        
        {/* Header */}
        <header className="px-4 pt-6 pb-3 flex flex-col gap-3 shrink-0 bg-transparent md:px-10 md:pt-10 md:pb-4">
          <Link href="/iqra/hijaiyah" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1885A4] transition-colors w-fit group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Huruf
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-4 pb-24 sm:px-6 md:pb-28">
          
          <div className="relative group flex w-full max-w-[400px] flex-col items-center">
            
            {/* The giant letter card */}
            <div className={`relative w-full bg-white/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-16 border ${isRecording ? 'border-red-400/50 shadow-[0_20px_60px_rgba(248,113,113,0.15)]' : 'border-white/60 shadow-[0_20px_60px_rgba(24,133,164,0.08)]'} transition-all duration-500 flex flex-col items-center justify-center aspect-square`}>
              
              {/* Animated aura when playing audio */}
              <div className={`absolute inset-0 bg-[#1885A4]/10 rounded-[3rem] blur-3xl transition-opacity duration-700 pointer-events-none ${isPlaying ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-100'}`}></div>

              {/* Animated aura when recording */}
              <div className={`absolute inset-0 bg-red-400/10 rounded-[3rem] blur-3xl transition-opacity duration-700 pointer-events-none ${isRecording ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-100'}`}></div>

              <span className={`font-arabic font-bold text-[min(45vw,180px)] leading-none drop-shadow-sm mb-3 md:mb-4 relative z-10 transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-gray-800'}`}>
                {letter.char}
              </span>
              
              <div className="mt-2 md:mt-4 text-center relative z-10">
                <span className={`text-lg md:text-xl font-black uppercase tracking-[0.3em] transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-[#1885A4]'}`}>
                  {letter.name}
                </span>
                <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 font-medium tracking-wide">
                  {isRecording ? "Sedang Merekam..." : "Pelafalan Dasar"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS (Positioned below the card) */}
            <div className="absolute -bottom-8 flex items-center gap-4 sm:-bottom-10 sm:gap-6">
              
              {/* Play Guide Button */}
              <button 
                onClick={toggleAudio}
                disabled={!letter.audio}
                title="Putar Contoh Audio"
                className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 outline-none focus:ring-4 focus:ring-[#1885A4]/40 disabled:cursor-not-allowed disabled:opacity-40 ${
                  isPlaying 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/40' 
                    : 'bg-[#1885A4] text-white shadow-[#1885A4]/40'
                }`}
              >
                {isPlaying ? (
                  <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-12 h-12 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>

              {/* Record Button */}
              <button 
                onClick={toggleRecording}
                disabled={isAnalyzing}
                title={isRecording ? "Hentikan Rekaman" : "Rekam Suara Anda"}
                className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 outline-none focus:ring-4 focus:ring-red-400/40 ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse' 
                    : 'bg-white text-red-500 border-2 border-red-100 hover:bg-red-50 shadow-black/5'
                }`}
              >
                {isRecording ? (
                  // Stop Icon
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
                ) : isAnalyzing ? (
                  <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                ) : (
                  // Mic Icon
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                )}
              </button>

            </div>

            {/* Play Recorded Audio Button */}
            {recordedAudioUrl && !isRecording && (
              <div className="absolute -bottom-28 animate-fade-in-up">
                <button
                  onClick={playRecordedAudio}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all hover:border-[#1885A4]/30"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlayingRecord ? 'bg-emerald-500 animate-pulse' : 'bg-[#1885A4]'}`}></div>
                  {isPlayingRecord ? 'Memutar Rekaman Anda...' : 'Dengarkan Rekaman Anda'}
                </button>
              </div>
            )}

            {isAnalyzing && (
              <p className="absolute -bottom-32 text-sm font-semibold text-[#1885A4]">
                Menganalisis pengucapan...
              </p>
            )}

            {speechResult && !isAnalyzing && (
              <div className="absolute -bottom-40 text-center text-sm">
                <p className={`font-bold ${speechResult.correct ? 'text-emerald-600' : 'text-red-500'}`}>
                  {speechResult.correct ? '✅ Pengucapan benar!' : speechResult.error ? '❌ Gagal mengenali suara.' : '❌ Coba lagi ya!'}
                </p>
                {speechResult.transcript && (
                  <p className="mt-1 text-gray-500">Terdengar: <span className="font-semibold">{speechResult.transcript}</span></p>
                )}
              </div>
            )}

            {/* Sound Wave Visualizer */}
            <div className={`absolute -bottom-40 flex items-center gap-1.5 transition-all duration-500 ${isPlaying || isRecording || isPlayingRecord ? 'opacity-100' : 'opacity-0'}`}>
              {waveformHeights.map((height, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full animate-bounce ${isRecording ? 'bg-red-400' : 'bg-emerald-400'}`}
                  style={{
                    height: (isPlaying || isRecording || isPlayingRecord) ? `${height}px` : '4px',
                    animationDuration: `${0.3 + (i % 4) * 0.1}s`,
                    animationDelay: `${(i % 5) * 0.1}s`
                  }}
                ></div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
