"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  where,
  setDoc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { Habit, NewHabit, HabitLog } from "@/src/types/habit";

export function useHabits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const habitsRef = collection(db, "users", user.uid, "habits");
    const q = query(habitsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Habit[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Habit, "id">),
      }));
      setHabits(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addHabit = async (newHabit: NewHabit) => {
    if (!user) return;
    const habitsRef = collection(db, "users", user.uid, "habits");
    await addDoc(habitsRef, {
      name: newHabit.name,
      icon: newHabit.icon,
      createdAt: Date.now(),
    });
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;
    const habitRef = doc(db, "users", user.uid, "habits", habitId);
    await deleteDoc(habitRef);
  };

  return { habits, loading, addHabit, deleteHabit };
}

export function useHabitLogs(date: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }

    const logsRef = collection(db, "users", user.uid, "habitLogs");
    const q = query(logsRef, where("date", "==", date));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: HabitLog[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<HabitLog, "id">),
      }));
      setLogs(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  const toggleHabitLog = async (habitId: string, date: string, currentlyCompleted: boolean) => {
    if (!user) return;
    const logId = `${habitId}_${date}`;
    const logRef = doc(db, "users", user.uid, "habitLogs", logId);
    await setDoc(logRef, {
      habitId,
      date,
      completed: !currentlyCompleted,
    });
  };

  return { logs, loading, toggleHabitLog };
}
