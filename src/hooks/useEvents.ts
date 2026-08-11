"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { LifeEvent, NewLifeEvent } from "@/src/types/event";

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const eventsRef = collection(db, "users", user.uid, "events");
    const q = query(eventsRef, orderBy("date", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: LifeEvent[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LifeEvent, "id">),
      }));
      setEvents(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addEvent = async (newEvent: NewLifeEvent) => {
    if (!user) return;
    const eventsRef = collection(db, "users", user.uid, "events");
    await addDoc(eventsRef, {
      title: newEvent.title,
      date: newEvent.date,
      category: newEvent.category,
      priority: newEvent.priority,
      ...(newEvent.time ? { time: newEvent.time } : {}),
      ...(newEvent.location ? { location: newEvent.location } : {}),
      ...(newEvent.notes ? { notes: newEvent.notes } : {}),
      createdAt: Date.now(),
    });
  };

  const deleteEvent = async (eventId: string) => {
    if (!user) return;
    const eventRef = doc(db, "users", user.uid, "events", eventId);
    await deleteDoc(eventRef);
  };

  const updateEvent = async (eventId: string, updates: Partial<NewLifeEvent>) => {
    if (!user) return;
    const eventRef = doc(db, "users", user.uid, "events", eventId);
    await updateDoc(eventRef, updates);
  };

  return { events, loading, addEvent, deleteEvent, updateEvent };
}
