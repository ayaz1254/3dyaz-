"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function PwaInstallPrompt() {
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (display-mode: standalone)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone
    ) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setShow(true);
    };

    const installedHandler = () => {
      setInstalled(true);
      setShow(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    // Show prompt automatically after 30s if available
    const timer = setTimeout(() => {
      // Only auto-show if we have the prompt
    }, 30000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      clearTimeout(timer);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setInstalled(true);
    }
    deferredPrompt = null;
    setShow(false);
  }

  if (installed) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 48 }}
          className="fixed bottom-24 right-6 z-50 max-w-xs md:bottom-24"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0f0f1a]/95 p-4 shadow-2xl shadow-cyan-500/10 backdrop-blur-2xl">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
                  3D
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">3D Magza</p>
                  <p className="text-[10px] text-gray-500">Uygulamayı yükle</p>
                </div>
              </div>
              <button
                onClick={() => setShow(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-white/5"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mb-3 text-xs text-gray-400">
              Ana ekranınıza ekleyin, uygulama gibi kullanın. Daha hızlı erişim ve kesintisiz deneyim.
            </p>
            <button
              onClick={handleInstall}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/40"
            >
              Uygulamayı Yükle
            </button>
            <p className="mt-2 text-[10px] text-gray-600">Kurulum gerektirmez, ücretsizdir.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
