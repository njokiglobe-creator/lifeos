"use client";

import { Bell, X } from "lucide-react";
import { useState } from "react";
import { usePushSubscription } from "@/src/hooks/usePushSubscription";

export default function NotificationBanner() {
  const { permission, subscribed, subscribe } = usePushSubscription();
  const [dismissed, setDismissed] = useState(false);

  if (permission === "granted" || permission === "denied" || dismissed || subscribed) return null;
  if (typeof window !== "undefined" && !("Notification" in window)) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border-b border-border text-sm">
      <Bell size={16} className="text-accent-dawn shrink-0" />
      <p className="flex-1 text-foreground">
        Enable notifications to get reminders for your schedule — even when the app is closed.
      </p>
      <button
        onClick={subscribe}
        className="bg-dawn-gradient text-[#0b0d12] text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90 transition shrink-0"
      >
        Enable
      </button>
      <button onClick={() => setDismissed(true)} className="text-muted hover:text-foreground transition shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}
