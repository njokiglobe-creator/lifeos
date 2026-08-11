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
import type { Book, NewBook, BookStatus } from "@/src/types/book";

export function useBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }
    const ref = collection(db, "users", user.uid, "books");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Book, "id">) })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const addBook = async (newBook: NewBook) => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "books");
    await addDoc(ref, {
      title: newBook.title,
      author: newBook.author,
      totalPages: newBook.totalPages,
      currentPage: 0,
      status: "reading" as BookStatus,
      ...(newBook.notes ? { notes: newBook.notes } : {}),
      createdAt: Date.now(),
    });
  };

  const updatePages = async (bookId: string, currentPage: number, totalPages: number) => {
    if (!user) return;
    const ref = doc(db, "users", user.uid, "books", bookId);
    const status: BookStatus = currentPage >= totalPages ? "finished" : "reading";
    await updateDoc(ref, { currentPage, status });
  };

  const deleteBook = async (bookId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "books", bookId));
  };

  return { books, loading, addBook, updatePages, deleteBook };
}
