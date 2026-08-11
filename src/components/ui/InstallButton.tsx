"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => setInstalled(true));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    setIsIOS(/iphone|ipad|ipod/i.test(navigator.userAgent) && !("MSStream" in window));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (installed) {
    return <p className="text-sm text-accent-success">✓ Installed</p>;
  }

  if (isIOS) {
    return (
      <p className="text-sm text-muted">
        On iPhone: tap the Share icon in Safari, then <strong className="text-foreground">"Add to Home Screen."</strong>
      </p>
    );
  }

  if (!deferredPrompt) {
    return (
      <p className="text-sm text-muted">
        Use your browser menu → <strong className="text-foreground">"Install app"</strong> or{" "}
        <strong className="text-foreground">"Add to Home Screen."</strong>
      </p>
    );
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
    >
      <Download size={16} />
      Install LifeOS
    </button>
  );
}
