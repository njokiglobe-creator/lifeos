"use client";

import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useScheduleNotifications } from "@/src/hooks/useScheduleNotifications";

export default function NotificationBanner() {
  const { permission, requestPermission } = useScheduleNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (permission === "granted" || permission === "denied" || dismissed) return null;
  if (typeof window !== "undefined" && !("Notification" in window)) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-sm">
      <Bell size={16} className="text-neutral-400 shrink-0" />
      <p className="flex-1 text-neutral-300">
        Enable notifications to get reminders when it's time for your next scheduled task.
      </p>
      <button
        onClick={requestPermission}
        className="bg-white text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-neutral-200 transition shrink-0"
      >
        Enable
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="text-neutral-500 hover:text-white transition shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}
