"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useBooks } from "@/src/hooks/useBooks";

export default function ReadingPage() {
  const { books, loading, addBook, updatePages, deleteBook } = useBooks();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const pages = parseInt(totalPages, 10);
    if (!title.trim() || !author.trim() || !pages) return;
    setSubmitting(true);
    try {
      await addBook({ title: title.trim(), author: author.trim(), totalPages: pages });
      setTitle("");
      setAuthor("");
      setTotalPages("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const reading = books.filter((b) => b.status === "reading");
  const finished = books.filter((b) => b.status === "finished");

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Reading</h1>
            <p className="text-sm text-neutral-400">
              {reading.length > 0 ? `${reading.length} in progress` : "Nothing on the shelf yet"}
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-200 transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add book"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Book title" className="w-full bg-transparent border-none outline-none text-sm placeholder:text-neutral-500" autoFocus />
            <div className="flex items-center gap-2">
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm placeholder:text-neutral-500" />
              <input type="number" value={totalPages} onChange={(e) => setTotalPages(e.target.value)} placeholder="Pages" className="w-24 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm placeholder:text-neutral-500" />
              <button type="submit" disabled={submitting} className="bg-white text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-neutral-200 transition disabled:opacity-40">Add</button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : books.length === 0 ? (
          <p className="text-sm text-neutral-500">No books yet — add one above.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reading.map((book) => {
              const pct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
              return (
                <div key={book.id} className="group p-4 rounded-xl border border-neutral-800 bg-neutral-950">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{book.title}</p>
                      <p className="text-xs text-neutral-500">{book.author}</p>
                    </div>
                    <button onClick={() => deleteBook(book.id)} className="text-neutral-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>{book.currentPage} / {book.totalPages} pages ({pct}%)</span>
                    <input
                      type="number"
                      defaultValue={book.currentPage}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) updatePages(book.id, val, book.totalPages);
                      }}
                      className="w-16 bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-right"
                    />
                  </div>
                </div>
              );
            })}

            {finished.length > 0 && (
              <>
                <p className="text-xs text-neutral-600 uppercase tracking-wide mt-4 mb-1">Finished</p>
                {finished.map((book) => (
                  <div key={book.id} className="group flex items-center justify-between p-3 rounded-xl border border-neutral-900 bg-neutral-950/50 opacity-60">
                    <div>
                      <p className="text-sm">{book.title}</p>
                      <p className="text-xs text-neutral-500">{book.author}</p>
                    </div>
                    <button onClick={() => deleteBook(book.id)} className="text-neutral-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </ProtectedShell>
  );
}
