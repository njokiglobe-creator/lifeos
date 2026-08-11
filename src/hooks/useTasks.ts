"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { useAuth } from "@/src/hooks/useAuth";
import type { Task, NewTask } from "@/src/types/task";

export function useTasks(date: string) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksRef = collection(db, "users", user.uid, "tasks");
    const q = query(tasksRef, where("date", "==", date), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: Task[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Task, "id">),
      }));
      setTasks(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  const addTask = async (newTask: NewTask) => {
    if (!user) return;
    const tasksRef = collection(db, "users", user.uid, "tasks");
    await addDoc(tasksRef, {
      title: newTask.title,
      date: newTask.date,
      priority: newTask.priority,
      ...(newTask.time ? { time: newTask.time } : {}),
      completed: false,
      createdAt: Date.now(),
    });
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!user) return;
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, { completed: !completed });
  };

  const deleteTask = async (taskId: string) => {
    if (!user) return;
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  return { tasks, loading, addTask, toggleTask, deleteTask };
}
