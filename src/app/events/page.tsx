"use client";

import { useState } from "react";
import { Plus, Trash2, X, MapPin } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useEvents } from "@/src/hooks/useEvents";
import type { EventCategory, EventPriority } from "@/src/types/event";

const CATEGORIES: EventCategory[] = [
  "Personal",
  "Work",
  "Sports",
  "Travel",
  "Health",
  "Finance",
  "Education",
  "Custom",
];

const categoryStyles: Record<EventCategory, string> = {
  Personal: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Work: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Sports: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Travel: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Health: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Finance: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Education: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Custom: "bg-surface-raised text-muted border-border",
};

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatEventDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff < 0) return "Past";
  return `In ${diff} days`;
}

export default function EventsPage() {
  const { events, loading, addEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayString());
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<EventCategory>("Personal");
  const [priority, setPriority] = useState<EventPriority>("medium");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDate(todayString());
    setTime("");
    setLocation("");
    setNotes("");
    setCategory("Personal");
    setPriority("medium");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSubmitting(true);
    try {
      await addEvent({
        title: title.trim(),
        date,
        time: time || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined,
        category,
        priority,
      });
      resetForm();
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
            <h1 className="font-display italic text-3xl mb-1">Events</h1>
            <p className="text-sm text-muted">
              {upcoming.length > 0
                ? `${upcoming.length} upcoming`
                : "Nothing scheduled yet"}
            </p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add event"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface pop-in"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title (e.g. Friend's Wedding)"
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted"
              autoFocus
            />

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as EventPriority)}
                className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location (optional)"
              className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted resize-none"
            />

            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    category === cat
                      ? categoryStyles[cat]
                      : "border-border text-muted hover:border-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || !title.trim() || !date}
              className="self-end flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-40"
            >
              Save Event
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-muted">Loading events...</p>
        ) : (
          <>
            {upcoming.length === 0 && past.length === 0 ? (
              <p className="text-sm text-muted">
                No events yet — add your first one above.
              </p>
            ) : (
              <div className="flex flex-col gap-2 stagger">
                {upcoming.map((event) => (
                  <div
                    key={event.id}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-surface card-hover transition"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${categoryStyles[event.category]}`}
                        >
                          {event.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        {formatEventDate(event.date)}
                        {event.time && ` · ${event.time}`}
                        {" · "}
                        <span className="text-accent-dawn">{daysUntil(event.date)}</span>
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted mt-1 flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </p>
                      )}
                      {event.notes && (
                        <p className="text-xs text-muted mt-1">{event.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-muted hover:text-accent-danger transition opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {past.length > 0 && (
                  <>
                    <p className="text-xs text-muted uppercase tracking-wide mt-6 mb-2">
                      Past
                    </p>
                    {past.map((event) => (
                      <div
                        key={event.id}
                        className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-surface/50 opacity-50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-muted">
                            {formatEventDate(event.date)}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-muted hover:text-accent-danger transition opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedShell>
  );
}
