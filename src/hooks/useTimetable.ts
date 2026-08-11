"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { TimetableBlock, NewTimetableBlock } from "@/src/types/timetable";

function sortBlocks(blocks: TimetableBlock[]) {
  return [...blocks].sort((a, b) => a.time.localeCompare(b.time));
}

export function useTimetableBlocks() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<TimetableBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBlocks([]);
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid, "settings", "timetable");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? (snap.data() as { blocks: TimetableBlock[] }) : { blocks: [] };
      setBlocks(sortBlocks(data.blocks || []));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addBlock = async (newBlock: NewTimetableBlock) => {
    if (!user) return;
    const id = `${Date.now()}`;
    const updated = sortBlocks([...blocks, { id, ...newBlock }]);
    const ref = doc(db, "users", user.uid, "settings", "timetable");
    await setDoc(ref, { blocks: updated });
  };

  const deleteBlock = async (blockId: string) => {
    if (!user) return;
    const updated = blocks.filter((b) => b.id !== blockId);
    const ref = doc(db, "users", user.uid, "settings", "timetable");
    await setDoc(ref, { blocks: updated });
  };

  return { blocks, loading, addBlock, deleteBlock };
}

// Single-day version (kept for potential reuse elsewhere)
export function useTimetableLog(date: string) {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompletions({});
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid, "timetableLogs", date);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists() ? (snap.data() as { completions: Record<string, boolean> }) : { completions: {} };
      setCompletions(data.completions || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, date]);

  const toggleBlock = async (blockId: string) => {
    if (!user) return;
    const updated = { ...completions, [blockId]: !completions[blockId] };
    const ref = doc(db, "users", user.uid, "timetableLogs", date);
    await setDoc(ref, { completions: updated }, { merge: true });
  };

  return { completions, loading, toggleBlock };
}

// Week version: loads completions for every date in [startDate, endDate]
// (inclusive), keyed by date string, e.g. { "2026-08-10": { blockId: true } }
export function useTimetableWeek(startDate: string, endDate: string) {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWeekData({});
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", user.uid, "timetableLogs");
    const q = query(ref, where(documentId(), ">=", startDate), where(documentId(), "<=", endDate));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: Record<string, Record<string, boolean>> = {};
      snapshot.docs.forEach((d) => {
        const data = d.data() as { completions?: Record<string, boolean> };
        result[d.id] = data.completions || {};
      });
      setWeekData(result);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, startDate, endDate]);

  const toggleCell = async (date: string, blockId: string) => {
    if (!user) return;
    const currentDayCompletions = weekData[date] || {};
    const updated = { ...currentDayCompletions, [blockId]: !currentDayCompletions[blockId] };
    const ref = doc(db, "users", user.uid, "timetableLogs", date);
    await setDoc(ref, { completions: updated }, { merge: true });
  };

  return { weekData, loading, toggleCell };
}
