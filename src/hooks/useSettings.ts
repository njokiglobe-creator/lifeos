"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";

export type UserPreferences = {
  themeId: string;
};

const DEFAULT_PREFS: UserPreferences = { themeId: "dawn" };

export function useSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPrefs(DEFAULT_PREFS);
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid, "settings", "preferences");
    const unsubscribe = onSnapshot(ref, (snap) => {
      setPrefs(snap.exists() ? { ...DEFAULT_PREFS, ...(snap.data() as UserPreferences) } : DEFAULT_PREFS);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const setThemeId = async (themeId: string) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "settings", "preferences");
    await setDoc(ref, { themeId }, { merge: true });
  };

  return { prefs, loading, setThemeId };
}
