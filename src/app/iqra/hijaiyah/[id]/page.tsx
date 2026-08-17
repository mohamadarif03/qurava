"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

const hijaiyahData: Record<string, { char: string, name: string, audio: string }> = {
  "alif": { char: "ا", name: "Alif", audio: "/audio/hijaiyah/alif.mp3" },
  "baa": { char: "ب", name: "Ba", audio: "/audio/hijaiyah/baa.mp3" },
  "ta": { char: "ت", name: "Ta", audio: "/audio/hijaiyah/ta.mp3" },
};

export default function HijaiyahDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const letter = hijaiyahData[id];

  // Base Audio States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingRecord, setIsPlayingRecord] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  // Init base audio
  useEffect(() => {
    if (letter) {
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
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedAudioUrl(null); // Clear previous recording if any
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Izin mikrofon diperlukan untuk fitur ini.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
      <div className="flex h-screen w-full bg-[#FAF8F1] items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Huruf tidak ditemukan atau terkunci.</h1>
          <Link href="/iqra/hijaiyah" className="text-[#1885A4] hover:underline font-medium">Kembali ke Daftar Huruf</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#FAF8F1] overflow-hidden font-sans relative">
      
      {/* ═══════════════ BACKGROUND EFFECTS ═══════════════ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden opacity-[0.03] mix-blend-multiply flex items-center justify-center">
        <span className="font-arabic text-[800px] leading-none text-[#1885A4]">{letter.char}</span>
      </div>

      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#1885A4]/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/iqra" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Header */}
        <header className="px-10 pt-10 pb-4 flex flex-col gap-4 shrink-0 bg-transparent">
          <Link href="/iqra/hijaiyah" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#1885A4] transition-colors w-fit group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Daftar Huruf
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          
          <div className="relative group flex flex-col items-center">
            
            {/* The giant letter card */}
            <div className={`relative bg-white/80 backdrop-blur-xl rounded-[3rem] p-16 border ${isRecording ? 'border-red-400/50 shadow-[0_20px_60px_rgba(248,113,113,0.15)]' : 'border-white/60 shadow-[0_20px_60px_rgba(24,133,164,0.08)]'} transition-all duration-500 flex flex-col items-center justify-center aspect-square min-w-[320px] md:min-w-[400px]`}>
              
              {/* Animated aura when playing audio */}
              <div className={`absolute inset-0 bg-[#1885A4]/10 rounded-[3rem] blur-3xl transition-opacity duration-700 pointer-events-none ${isPlaying ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-100'}`}></div>

              {/* Animated aura when recording */}
              <div className={`absolute inset-0 bg-red-400/10 rounded-[3rem] blur-3xl transition-opacity duration-700 pointer-events-none ${isRecording ? 'opacity-100 scale-110 animate-pulse' : 'opacity-0 scale-100'}`}></div>

              <span className={`font-arabic font-bold text-[180px] md:text-[220px] leading-none drop-shadow-sm mb-4 relative z-10 transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-gray-800'}`}>
                {letter.char}
              </span>
              
              <div className="mt-2 text-center relative z-10">
                <span className={`text-xl font-black uppercase tracking-[0.3em] transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-[#1885A4]'}`}>
                  {letter.name}
                </span>
                <p className="text-sm text-gray-400 mt-2 font-medium tracking-wide">
                  {isRecording ? "Sedang Merekam..." : "Pelafalan Dasar"}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS (Positioned below the card) */}
            <div className="absolute -bottom-10 flex items-center gap-6">
              
              {/* Play Guide Button */}
              <button 
                onClick={toggleAudio}
                title="Putar Contoh Audio"
                className={`flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 outline-none focus:ring-4 focus:ring-[#1885A4]/40 ${
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
                title={isRecording ? "Hentikan Rekaman" : "Rekam Suara Anda"}
                className={`flex items-center justify-center w-24 h-24 rounded-full shadow-2xl transition-all duration-500 hover:scale-105 active:scale-95 outline-none focus:ring-4 focus:ring-red-400/40 ${
                  isRecording 
                    ? 'bg-red-500 text-white shadow-red-500/40 animate-pulse' 
                    : 'bg-white text-red-500 border-2 border-red-100 hover:bg-red-50 shadow-black/5'
                }`}
              >
                {isRecording ? (
                  // Stop Icon
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
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

            {/* Sound Wave Visualizer (Mock - Shows when either playing guide, recording, or playing record) */}
            <div className={`absolute -bottom-40 flex items-center gap-1.5 transition-all duration-500 ${isPlaying || isRecording || isPlayingRecord ? 'opacity-100' : 'opacity-0'}`}>
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-full animate-bounce ${isRecording ? 'bg-red-400' : 'bg-emerald-400'}`}
                  style={{
                    height: (isPlaying || isRecording || isPlayingRecord) ? `${Math.random() * 24 + 8}px` : '4px',
                    animationDuration: `${Math.random() * 0.5 + 0.3}s`,
                    animationDelay: `${Math.random() * 0.5}s`
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
