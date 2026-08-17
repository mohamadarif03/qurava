"use client";

import { useEffect } from "react";

export default function GlobalVoiceReader() {
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      // Hanya berjalan jika mode aksesibilitas adalah 'tunanetra'
      const mode = localStorage.getItem("accessibility_mode");
      if (mode !== "tunanetra") return;

      const target = e.target as HTMLElement;

      // Abaikan elemen di dalam Onboarding Modal karena mereka sudah memiliki suara sendiri
      if (target.closest('[role="dialog"]')) {
        return;
      }

      // Ambil teks dari elemen yang sedang difokuskan
      const textToSpeak = target.getAttribute("aria-label") || target.innerText || target.textContent;
      
      if (textToSpeak && textToSpeak.trim() !== "") {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          // Hentikan suara yang sedang berjalan agar tidak bertumpuk
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(textToSpeak.trim());
          utterance.lang = "id-ID";
          utterance.rate = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, []);

  // Komponen ini tidak me-render UI apapun
  return null;
}
