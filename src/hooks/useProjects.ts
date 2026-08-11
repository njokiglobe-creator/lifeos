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
import type { Project, NewProject } from "@/src/types/project";

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", user.uid, "projects");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addProject = async (newProject: NewProject) => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "projects");
    await addDoc(ref, {
      name: newProject.name,
      revenue: newProject.revenue ?? 0,
      progress: 0,
      ...(newProject.goal ? { goal: newProject.goal } : {}),
      ...(newProject.deadline ? { deadline: newProject.deadline } : {}),
      createdAt: Date.now(),
    });
  };

  const updateProject = async (projectId: string, updates: Partial<Pick<Project, "progress" | "revenue">>) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid, "projects", projectId), updates);
  };

  const deleteProject = async (projectId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "projects", projectId));
  };

  return { projects, loading, addProject, updateProject, deleteProject };
}
