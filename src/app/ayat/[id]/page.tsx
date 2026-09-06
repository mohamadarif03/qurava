"use client";

import React, { useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecorder } from "@/hooks/use-recorder";
import { transcribeAudio } from "@/services/audio-service";

type Verse = {
  id: number;
  arabic: string;
  latin: string;
  translation: string;
};

type SpeechResult = {
  correct: boolean;
  transcript?: string;
  error?: boolean;
};

const normalizeRecitation = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ً-ٟؐ-ؚٰ]/g, "")
    .replace(/[^\p{L}\p{N}\u0600-\u06ff]/gu, "");

const matchesVerse = (transcript: string, verse: Verse) => {
  const cleanTranscript = normalizeRecitation(transcript);
  if (!cleanTranscript) return false;

  return [verse.arabic, verse.latin].some((expected) => {
    const cleanExpected = normalizeRecitation(expected);
    return cleanTranscript.includes(cleanExpected) || cleanExpected.includes(cleanTranscript);
  });
};

export default function AyatDetailPage() {
  const params = useParams();
  const id = params?.id;
  
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isRecording, start, stop } = useRecorder();
  const [recordingVerseId, setRecordingVerseId] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechResult | null>(null);

  // Data statis khusus Al-Fatihah
  const surahData: { nameLatin: string; nameArabic: string; translation: string; ayahCount: number; verses: Verse[] } = {
    nameLatin: "Al-Fatihah",
    nameArabic: "الفاتحة",
    translation: "Pembukaan",
    ayahCount: 7,
    verses: [
      {
        id: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم",
        latin: "Bismillaahir-rahmaanir-rahiim",
        translation: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang."
      },
      {
        id: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        latin: "Alhamdu lillaahi rabbil-'aalamiin",
        translation: "Segala puji bagi Allah, Tuhan seluruh alam,"
      },
      {
        id: 3,
        arabic: "الرَّحْمَنِ الرَّحِيمِ",
        latin: "Ar-rahmaanir-rahiim",
        translation: "Yang Maha Pengasih, Maha Penyayang,"
      },
      {
        id: 4,
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        latin: "Maaliki yawmid-diin",
        translation: "Pemilik hari pembalasan."
      },
      {
        id: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        latin: "Iyyaaka na'budu wa iyyaaka nasta'iin",
        translation: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan."
      },
      {
        id: 6,
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        latin: "Ihdinash-shiraathal-mustaqiim",
        translation: "Tunjukilah kami jalan yang lurus,"
      },
      {
        id: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        latin: "Shiraathal-ladziina an'amta 'alaihim ghayril-maghdhuubi 'alaihim wa ladh-dhaalliin",
        translation: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat."
      }
    ]
  };

  const handlePlayAudio = async (verseId: number) => {
    if (playingId === verseId) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();
    setPlayingId(verseId);

    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/1:${verseId}/ar.alafasy`);
      const result = await response.json() as { code?: number; data?: { audio?: string } };
      if (result.code !== 200 || !result.data?.audio) throw new Error("Audio ayat tidak tersedia");

      const audio = new Audio(result.data.audio);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      await audio.play();
    } catch (error: unknown) {
      console.error("Failed to play verse audio:", error);
      setPlayingId(null);
    }
  };

  const handleBlob = async (blob: Blob, verse: Verse) => {
    setIsAnalyzing(true);
    setSpeechResult(null);

    try {
      const transcript = await transcribeAudio(blob);
      setSpeechResult({ correct: matchesVerse(transcript, verse), transcript });
    } catch (error: unknown) {
      console.error("Verse speech recognition failed:", error);
      setSpeechResult({ correct: false, error: true });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleListening = async (verse: Verse) => {
    if (isAnalyzing) return;
    if (isRecording) {
      stop();
      return;
    }

    setRecordingVerseId(verse.id);
    setSpeechResult(null);
    try {
      // Al-Fatihah verses need more time than the short-letter exercise.
      await start((blob) => handleBlob(blob, verse), 10_000);
    } catch (error: unknown) {
      console.error("Error accessing microphone:", error);
      setSpeechResult({ correct: false, error: true });
      setRecordingVerseId(null);
    }
  };

  // Jika ID bukan 1, tampilkan error ringan
  if (id !== "1") {
    return (
      <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans">
        <Sidebar activePath="/ayat" />
        <main className="min-w-0 flex-1 flex items-center justify-center flex-col px-4 pb-20 text-center lg:pb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Surat Belum Tersedia</h2>
          <Link href="/ayat" className="px-6 py-2 bg-[#1885A4] text-white rounded-full hover:bg-[#146e87]">
            Kembali ke Daftar Surat
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 w-full bg-[#FAF8F1] overflow-hidden font-sans">
      
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <Sidebar activePath="/ayat" />

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative pb-20 lg:pb-0">
        
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0L57 30L85 15L70 43L100 50L70 57L85 85L57 70L50 100L43 70L15 85L30 57L0 50L30 43L15 15L43 30Z" />
          </svg>
        </div>

        {/* Header */}
        <header className="px-4 pt-5 pb-3 sm:px-6 md:px-8 md:pt-8 md:pb-4 flex flex-col z-10 shrink-0 bg-white/60 backdrop-blur-md border-b border-gray-100">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4 mb-3 sm:mb-4">
            <Link href="/ayat" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1885A4] hover:border-[#1885A4] transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
            </Link>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2 sm:gap-3">
                {surahData.nameLatin} 
                <span className="text-[#1885A4] font-arabic font-normal text-2xl sm:text-3xl mt-1">({surahData.nameArabic})</span>
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
                <span className="uppercase tracking-widest text-[11px]">{surahData.translation}</span>
                <span className="text-gray-300">•</span>
                <span>{surahData.ayahCount} Ayat</span>
              </div>
            </div>
          </div>
        </header>

        {/* Verses List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-6 md:px-8 md:pb-12 md:pt-6 custom-scrollbar z-10">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {surahData.verses.map((verse) => (
              <div 
                key={verse.id} 
                className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border shadow-sm transition-all duration-300 ${
                  playingId === verse.id 
                    ? 'border-[#1885A4] shadow-[0_10px_30px_rgba(24,133,164,0.1)] ring-4 ring-[#1885A4]/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }`}
              >
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Controls (Number & Audio) */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-start gap-4 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 font-bold">
                      {verse.id}
                    </div>
                    <button 
                      onClick={() => handlePlayAudio(verse.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                        playingId === verse.id 
                          ? 'bg-emerald-50 text-emerald-500 border border-emerald-200' 
                          : 'bg-[#1885A4]/10 text-[#1885A4] border border-[#1885A4]/20 hover:bg-[#1885A4] hover:text-white'
                      }`}
                      title="Dengarkan Ayat"
                    >
                      {playingId === verse.id ? (
                        <div className="flex gap-0.5 items-center justify-center h-4">
                          <span className="w-1 bg-emerald-500 h-2/4 animate-bounce" style={{animationDelay: '0s'}}></span>
                          <span className="w-1 bg-emerald-500 h-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                          <span className="w-1 bg-emerald-500 h-3/4 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </div>
                      ) : (
                        <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Right Content (Arabic & Translation) */}
                  <div className="flex-1 flex flex-col">
                    {/* Arabic Text (Right Aligned) */}
                    <div className="text-right mb-6">
                      <p className="font-arabic text-4xl md:text-5xl leading-[2.2] text-gray-900" dir="rtl">
                        {verse.arabic}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mb-5"></div>

                    {/* Latin & Translation (Left Aligned) */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[#1885A4] font-medium text-sm">
                        {verse.latin}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {verse.translation}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleListening(verse)}
                          disabled={isAnalyzing || (isRecording && recordingVerseId !== verse.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            isRecording && recordingVerseId === verse.id
                              ? "bg-red-500 text-white"
                              : "bg-[#1885A4]/10 text-[#1885A4] hover:bg-[#1885A4]/20"
                          }`}
                        >
                          <span className="text-base">{isRecording && recordingVerseId === verse.id ? "■" : "🎤"}</span>
                          {isRecording && recordingVerseId === verse.id ? "Berhenti merekam" : "Latihan suara"}
                        </button>

                        {recordingVerseId === verse.id && isAnalyzing && (
                          <span className="text-xs font-semibold text-[#1885A4]">Menganalisis...</span>
                        )}

                        {recordingVerseId === verse.id && speechResult && !isAnalyzing && (
                          <span className={`text-xs font-bold ${speechResult.correct ? "text-emerald-600" : "text-red-500"}`}>
                            {speechResult.correct ? "✅ Bacaan benar" : speechResult.error ? "❌ Gagal mengenali suara" : "❌ Coba lagi"}
                          </span>
                        )}
                      </div>
                      {recordingVerseId === verse.id && speechResult?.transcript && (
                        <p className="text-xs italic text-gray-500">Terdengar: “{speechResult.transcript}”</p>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center pb-8">
            <Link href="/ayat" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1885A4] transition-colors shadow-sm">
              Selesai Membaca
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            </Link>
          </div>
        </div>
      </main>

      {/* Custom styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
        @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
        .font-arabic {
          font-family: 'Amiri', serif;
        }
      `}} />
    </div>
  );
}
