"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useHockey } from "@/src/hooks/useHockey";
import type { HockeyEventType } from "@/src/types/hockey";

const TYPE_LABELS: Record<HockeyEventType, string> = {
  training: "Training",
  match: "Match",
  recovery: "Recovery",
  team: "Team Event",
};

const TYPE_STYLES: Record<HockeyEventType, string> = {
  training: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  match: "bg-red-500/15 text-red-400 border-red-500/30",
  recovery: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  team: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function HockeyPage() {
  const { events, loading, addEvent, deleteEvent } = useHockey();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<HockeyEventType>("training");
  const [date, setDate] = useState(todayString());
  const [opponent, setOpponent] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSubmitting(true);
    try {
      await addEvent({
        title: title.trim(),
        type,
        date,
        opponent: opponent.trim() || undefined,
        location: location.trim() || undefined,
      });
      setTitle("");
      setOpponent("");
      setLocation("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const today = todayString();
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Hockey</h1>
            <p className="text-sm text-neutral-400">
              {upcoming.length > 0 ? `${upcoming.length} upcoming` : "Nothing scheduled"}
            </p>
          </div>
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-neutral-200 transition">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (e.g. vs Sailors Rivals)" className="w-full bg-transparent border-none outline-none text-sm placeholder:text-neutral-500" autoFocus />
            <div className="flex items-center gap-2 flex-wrap">
              {(Object.keys(TYPE_LABELS) as HockeyEventType[]).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`text-xs px-3 py-1.5 rounded-full border transition ${type === t ? TYPE_STYLES[t] : "border-neutral-800 text-neutral-500 hover:border-neutral-600"}`}>
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm" />
            {type === "match" && (
              <input type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="Opponent" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm placeholder:text-neutral-500" />
            )}
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (optional)" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-sm placeholder:text-neutral-500" />
            <button type="submit" disabled={submitting} className="self-end bg-white text-black text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-neutral-200 transition disabled:opacity-40">Save</button>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing scheduled yet — add one above.</p>
        ) : (
          <div className="flex flex-col gap-2 stagger">
            {upcoming.map((event) => (
              <div key={event.id} className="group flex items-start gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-950">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${TYPE_STYLES[event.type]}`}>{TYPE_LABELS[event.type]}</span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {event.date}{event.opponent && ` · vs ${event.opponent}`}{event.location && ` · ${event.location}`}
                  </p>
                </div>
                <button onClick={() => deleteEvent(event.id)} className="text-neutral-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {past.length > 0 && (
              <>
                <p className="text-xs text-neutral-600 uppercase tracking-wide mt-4 mb-1">Past</p>
                {past.map((event) => (
                  <div key={event.id} className="group flex items-start gap-3 p-3 rounded-xl border border-neutral-900 bg-neutral-950/50 opacity-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{event.title}</p>
                      <p className="text-xs text-neutral-500">{event.date}</p>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="text-neutral-600 hover:text-red-400 transition opacity-0 group-hover:opacity-100">
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
