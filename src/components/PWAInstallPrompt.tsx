'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek apakah sudah diinstall sebagai PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Cek apakah sudah pernah dismiss dalam sesi ini
    const dismissed = sessionStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) return;

    // Deteksi iOS
    const isIOSDevice = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // iOS tidak support beforeinstallprompt, tampilkan instruksi manual
      const timer = setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Tangkap event beforeinstallprompt untuk Android/Desktop
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const timer = setTimeout(() => {
        setShowBanner(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 1500);
      return () => clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShowBanner(false);
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }, 400);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-400 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        className={`fixed z-[9999] bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full transition-all duration-400 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0 md:scale-100'
            : 'opacity-0 translate-y-8 md:scale-95'
        }`}
      >
        <div className="bg-[#FFFDF8] rounded-t-3xl md:rounded-3xl shadow-2xl border border-[#1F4D3D]/10 overflow-hidden">
          {/* Header gradient strip */}
          <div className="h-1 bg-gradient-to-r from-[#1F4D3D] via-[#1885A4] to-[#9CC7B5]" />

          <div className="p-6 md:p-8">
            {/* Logo + Title */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1F4D3D] flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                <Image src="/logo.png" alt="QURAVA" width={56} height={56} className="object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-black text-[#111827] font-sans uppercase tracking-tight leading-none">
                  QURAVA
                </h2>
                <p className="text-sm text-[#1F4D3D] font-medium mt-0.5">Belajar Al-Qur&apos;an Lebih Mudah</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-[14px] text-gray-500 leading-relaxed mb-5">
              Install QURAVA sebagai aplikasi di perangkatmu untuk akses yang lebih cepat, pengalaman layar penuh, dan bisa digunakan kapan saja.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '⚡', label: 'Lebih Cepat' },
                { icon: '📱', label: 'Layar Penuh' },
                { icon: '🔖', label: 'Mudah Diakses' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-1.5 bg-[#1F4D3D]/5 rounded-xl py-3 px-2"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-[11px] font-semibold text-[#1F4D3D] text-center leading-tight">{item.label}</span>
                </div>
              ))}
            </div>

            {/* iOS Instructions */}
            {isIOS && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
                <p className="text-[13px] font-bold text-blue-800 mb-2">Cara Install di iPhone / iPad:</p>
                <ol className="space-y-1.5">
                  {[
                    <>Tap ikon <strong>Bagikan</strong> (□↑) di browser Safari</>,
                    <>Scroll ke bawah, pilih <strong>&ldquo;Tambahkan ke Layar Utama&rdquo;</strong></>,
                    <>Tap <strong>Tambahkan</strong> di pojok kanan atas</>,
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] text-blue-700">
                      <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-[#1F4D3D] text-white font-bold text-[14px] py-3.5 rounded-xl hover:bg-[#1F4D3D]/90 active:scale-[0.98] transition-all duration-150 shadow-md"
                >
                  Install Sekarang
                </button>
              )}
              <button
                onClick={handleDismiss}
                className={`font-semibold text-[14px] py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 text-gray-500 ${
                  isIOS ? 'flex-1' : 'px-5'
                }`}
              >
                {isIOS ? 'Mengerti' : 'Nanti'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
