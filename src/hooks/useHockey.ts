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
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { HockeyEvent, NewHockeyEvent } from "@/src/types/hockey";

export function useHockey() {
  const { user } = useAuth();
  const [events, setEvents] = useState<HockeyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", user.uid, "hockeyEvents");
    const q = query(ref, orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<HockeyEvent, "id">) })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addEvent = async (newEvent: NewHockeyEvent) => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "hockeyEvents");
    await addDoc(ref, {
      title: newEvent.title,
      type: newEvent.type,
      date: newEvent.date,
      ...(newEvent.time ? { time: newEvent.time } : {}),
      ...(newEvent.opponent ? { opponent: newEvent.opponent } : {}),
      ...(newEvent.location ? { location: newEvent.location } : {}),
      ...(newEvent.notes ? { notes: newEvent.notes } : {}),
      createdAt: Date.now(),
    });
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "hockeyEvents", eventId));
  };

  return { events, loading, addEvent, deleteEvent };
}
