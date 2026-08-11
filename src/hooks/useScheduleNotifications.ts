"use client";

import { useEffect, useState, useCallback } from "react";
import { SCHEDULE } from "@/src/lib/schedule";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function firedKey(date: string, blockId: string) {
  return `lifeos_notified_${date}_${blockId}`;
}

export function useScheduleNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }, []);

  useEffect(() => {
    if (permission !== "granted") return;

    const checkSchedule = () => {
      const today = todayString();
      const now = currentTimeString();

      SCHEDULE.forEach((block, index) => {
        if (block.time !== now) return;

        const key = firedKey(today, block.id);
        if (localStorage.getItem(key)) return; // already notified for this block today

        const previous = index > 0 ? SCHEDULE[index - 1] : null;

        if (previous) {
          new Notification(`✅ ${previous.label} complete`, {
            body: `Time for: ${block.label}`,
            tag: `${block.id}-transition`,
          });
        } else {
          new Notification(`⏰ Time for: ${block.label}`, {
            tag: block.id,
          });
        }

        localStorage.setItem(key, "1");
      });
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, [permission]);

  return { permission, requestPermission };
}
