"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useHabits, useHabitLogs } from "@/src/hooks/useHabits";

function todayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SUGGESTED_ICONS = ["💧", "🏃", "📖", "🧘", "😴", "✍️", "🥗", "🚭"];

export default function HabitsPage() {
  const today = todayString();
  const { habits, loading: habitsLoading, addHabit, deleteHabit } = useHabits();
  const { logs, toggleHabitLog } = useHabitLogs(today);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💧");
  const [submitting, setSubmitting] = useState(false);

  const isCompleted = (habitId: string) =>
    logs.find((l) => l.habitId === habitId)?.completed ?? false;

  const completedCount = habits.filter((h) => isCompleted(h.id)).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await addHabit({ name: name.trim(), icon });
      setName("");
      setIcon("💧");
      setShowAddForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-3xl mb-1">Habits</h1>
            <p className="text-sm text-muted">
              {habits.length > 0
                ? `${completedCount}/${habits.length} done today`
                : "Build your daily routine"}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm((s) => !s)}
            className="flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? "Cancel" : "Add habit"}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAdd}
            className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface pop-in"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name (e.g. Drink Water)"
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted"
              autoFocus
            />
            <div className="flex items-center gap-2 flex-wrap">
              {SUGGESTED_ICONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`text-lg w-9 h-9 flex items-center justify-center rounded-lg border transition ${
                    icon === emoji
                      ? "border-accent-dawn bg-surface-raised"
                      : "border-border hover:border-muted"
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <button
                type="submit"
                disabled={submitting || !name.trim()}
                className="ml-auto flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {habitsLoading ? (
          <p className="text-sm text-muted">Loading habits...</p>
        ) : habits.length === 0 ? (
          <p className="text-sm text-muted">
            No habits yet — add your first one above.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 stagger">
            {habits.map((habit) => {
              const done = isCompleted(habit.id);
              return (
                <div
                  key={habit.id}
                  className={`relative group p-4 rounded-xl border transition cursor-pointer card-hover ${
                    done
                      ? "border-accent-success/50 bg-accent-success/10"
                      : "border-border bg-surface hover:border-muted"
                  }`}
                  onClick={() => toggleHabitLog(habit.id, today, done)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                    className="absolute top-2 right-2 text-muted hover:text-accent-danger transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="text-2xl mb-2">{habit.icon}</div>
                  <p
                    className={`text-sm font-medium ${
                      done ? "text-accent-success" : "text-foreground"
                    }`}
                  >
                    {habit.name}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {done ? "Done today" : "Tap to complete"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedShell>
  );
}
