"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { JournalEntry, JournalEntryInput } from "@/src/types/journal";

export function useJournal(date: string) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEntry(null);
      setLoading(false);
      return;
    }

    const entryRef = doc(db, "users", user.uid, "journalEntries", date);
    const unsubscribe = onSnapshot(entryRef, (snap) => {
      if (snap.exists()) {
        setEntry(snap.data() as JournalEntry);
      } else {
        setEntry(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  const saveEntry = async (input: JournalEntryInput) => {
    if (!user) return;
    const entryRef = doc(db, "users", user.uid, "journalEntries", date);
    await setDoc(entryRef, {
      date,
      ...input,
      updatedAt: Date.now(),
    });
  };

  return { entry, loading, saveEntry };
}
