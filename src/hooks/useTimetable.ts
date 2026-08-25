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
import type { TimetableBlock, NewTimetableBlock, TimetableStatus } from "@/src/types/timetable";

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

// Single-day version: powers the daily timetable view. Each block can be
// marked "done" or "skipped" (e.g. "no training 3 days from now") — skipped
// blocks are excluded from missed/discipline-score counts for that date.
export function useTimetableLog(date: string) {
  const { user } = useAuth();
  const [completions, setCompletions] = useState<Record<string, TimetableStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompletions({});
      setLoading(false);
      return;
    }
    const ref = doc(db, "users", user.uid, "timetableLogs", date);
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.exists()
        ? (snap.data() as { completions: Record<string, TimetableStatus> })
        : { completions: {} };
      setCompletions(data.completions || {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, date]);

  const setBlockStatus = async (blockId: string, status: TimetableStatus | null) => {
    if (!user) return;
    const updated = { ...completions };
    if (status) {
      updated[blockId] = status;
    } else {
      delete updated[blockId];
    }
    const ref = doc(db, "users", user.uid, "timetableLogs", date);
    await setDoc(ref, { completions: updated }, { merge: true });
  };

  const toggleDone = (blockId: string) => {
    setBlockStatus(blockId, completions[blockId] === "done" ? null : "done");
  };

  const toggleSkipped = (blockId: string) => {
    setBlockStatus(blockId, completions[blockId] === "skipped" ? null : "skipped");
  };

  return { completions, loading, toggleDone, toggleSkipped };
}

// Week version: read-only, used by the Stats page to roll up completions for
// every date in [startDate, endDate] (inclusive), e.g. { "2026-08-10": { blockId: "done" } }
export function useTimetableWeek(startDate: string, endDate: string) {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState<Record<string, Record<string, TimetableStatus>>>({});
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
      const result: Record<string, Record<string, TimetableStatus>> = {};
      snapshot.docs.forEach((d) => {
        const data = d.data() as { completions?: Record<string, TimetableStatus> };
        result[d.id] = data.completions || {};
      });
      setWeekData(result);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, startDate, endDate]);

  return { weekData, loading };
}
