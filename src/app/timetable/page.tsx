"use client";

import { useState } from "react";
import { Check, Ban, ChevronLeft, ChevronRight } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import JournalForm from "@/src/components/ui/JournalForm";
import { useTimetableLog } from "@/src/hooks/useTimetable";
import { SCHEDULE } from "@/src/lib/schedule";
import type { TimetableStatus } from "@/src/types/timetable";

function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseDateString(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function shiftDateString(dateStr: string, days: number) {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

function currentTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function dayHeading(dateStr: string, today: string) {
  if (dateStr === today) return "Today";
  if (dateStr === shiftDateString(today, 1)) return "Tomorrow";
  if (dateStr === shiftDateString(today, -1)) return "Yesterday";
  return parseDateString(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

type BlockState = "done" | "skipped" | "missed" | "upcoming";

function getBlockState(
  status: TimetableStatus | undefined,
  selectedDate: string,
  blockTime: string,
  today: string,
  now: string
): BlockState {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (selectedDate < today) return "missed";
  if (selectedDate === today && blockTime < now) return "missed";
  return "upcoming";
}

export default function TimetablePage() {
  const today = toDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const now = currentTimeString();

  const { completions, loading, toggleDone, toggleSkipped } = useTimetableLog(selectedDate);

  const doneCount = Object.values(completions).filter((s) => s === "done").length;
  const skippedCount = Object.values(completions).filter((s) => s === "skipped").length;

  return (
    <ProtectedShell>
      <div className="px-4 sm:px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-3xl mb-1">{dayHeading(selectedDate, today)}</h1>
            <p className="text-sm text-muted">
              {parseDateString(selectedDate).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {` · ${doneCount}/${SCHEDULE.length - skippedCount} done`}
              {skippedCount > 0 && ` · ${skippedCount} skipped`}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate((d) => shiftDateString(d, -1))}
              className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-muted transition"
            >
              <ChevronLeft size={16} />
            </button>
            {selectedDate !== today && (
              <button
                onClick={() => setSelectedDate(today)}
                className="px-3 py-2 rounded-lg border border-border text-xs text-muted hover:text-foreground hover:border-muted transition"
              >
                Today
              </button>
            )}
            <button
              onClick={() => setSelectedDate((d) => shiftDateString(d, 1))}
              className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-muted transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <div className="flex flex-col gap-2 stagger mb-10">
            {SCHEDULE.map((block) => {
              const status = completions[block.id];
              const state = getBlockState(status, selectedDate, block.time, today, now);
              return (
                <div
                  key={block.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    state === "done"
                      ? "border-accent-success/40 bg-accent-success/10"
                      : state === "skipped"
                      ? "border-border bg-surface/50 opacity-60"
                      : state === "missed"
                      ? "border-accent-danger/30 bg-accent-danger/5"
                      : "border-border bg-surface"
                  }`}
                >
                  <div className="w-14 shrink-0 text-xs font-mono text-muted">{block.time}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        state === "skipped" ? "line-through text-muted" : "text-foreground"
                      }`}
                    >
                      {block.label}
                    </p>
                    <p className="text-xs text-muted">
                      {state === "done" && "Completed"}
                      {state === "skipped" && "Skipped — won't count against you"}
                      {state === "missed" && <span className="text-accent-danger">Missed</span>}
                      {state === "upcoming" && "Upcoming"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleDone(block.id)}
                      title="Mark done"
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${
                        status === "done"
                          ? "bg-dawn-gradient border-transparent"
                          : "border-border hover:border-muted"
                      }`}
                    >
                      <Check size={14} className={status === "done" ? "text-[#0b0d12]" : "text-muted"} />
                    </button>
                    <button
                      onClick={() => toggleSkipped(block.id)}
                      title={status === "skipped" ? "Unskip" : "Skip this block"}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${
                        status === "skipped"
                          ? "border-accent-dawn/50 bg-accent-dawn/10 text-accent-dawn"
                          : "border-border text-muted hover:border-muted"
                      }`}
                    >
                      <Ban size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <h2 className="font-display italic text-2xl mb-4">Journal</h2>
          <JournalForm key={selectedDate} date={selectedDate} />
        </div>
      </div>
    </ProtectedShell>
  );
}
