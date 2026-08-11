"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useTimetableWeek } from "@/src/hooks/useTimetable";
import { SCHEDULE } from "@/src/lib/schedule";

function toDateString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function currentTimeString() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function getWeekDates(weekOffset: number) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function TimetablePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDates = getWeekDates(weekOffset);
  const weekDateStrings = weekDates.map(toDateString);
  const today = toDateString(new Date());
  const now = currentTimeString();

  const { weekData, loading, toggleCell } = useTimetableWeek(
    weekDateStrings[0],
    weekDateStrings[6]
  );

  const getCellState = (dateStr: string, blockTime: string, blockId: string) => {
    const done = weekData[dateStr]?.[blockId] ?? false;
    if (done) return "done";
    if (dateStr < today) return "missed";
    if (dateStr === today && blockTime < now) return "missed";
    return "upcoming";
  };

  return (
    <ProtectedShell>
      <div className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              {weekOffset === 0 ? "This Week" : weekOffset > 0 ? "Upcoming Week" : "Past Week"}
            </h1>
            <p className="text-sm text-neutral-400">
              {weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} –{" "}
              {weekDates[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition"
            >
              <ChevronLeft size={16} />
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="px-3 py-2 rounded-lg border border-neutral-800 text-xs text-neutral-400 hover:text-white hover:border-neutral-600 transition"
              >
                Today
              </button>
            )}
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="p-2 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full border-separate border-spacing-0 min-w-[640px]">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-black text-left text-xs text-neutral-500 font-normal pb-3 pr-3 w-40">
                    Schedule
                  </th>
                  {weekDates.map((d, i) => {
                    const dateStr = weekDateStrings[i];
                    const isToday = dateStr === today;
                    return (
                      <th key={dateStr} className="pb-3 px-1 text-center">
                        <div className={`text-xs font-medium ${isToday ? "text-white" : "text-neutral-500"}`}>
                          {d.toLocaleDateString(undefined, { weekday: "short" })}
                        </div>
                        <div className={`text-[11px] ${isToday ? "text-neutral-300" : "text-neutral-600"}`}>
                          {d.getDate()}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((block) => (
                  <tr key={block.id}>
                    <td className="sticky left-0 bg-black py-1.5 pr-3 border-t border-neutral-900">
                      <p className="text-sm text-neutral-200 leading-tight">{block.label}</p>
                      <p className="text-[11px] text-neutral-600">{block.time}</p>
                    </td>
                    {weekDateStrings.map((dateStr) => {
                      const state = getCellState(dateStr, block.time, block.id);
                      return (
                        <td key={dateStr} className="py-1.5 px-1 text-center border-t border-neutral-900">
                          <button
                            onClick={() => toggleCell(dateStr, block.id)}
                            className={`w-8 h-8 mx-auto rounded-lg border flex items-center justify-center transition ${
                              state === "done"
                                ? "bg-emerald-500 border-emerald-500"
                                : state === "missed"
                                ? "border-red-500/50 bg-red-500/10"
                                : "border-neutral-800 bg-neutral-950 hover:border-neutral-600"
                            }`}
                          >
                            {state === "done" && <Check size={14} className="text-black" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedShell>
  );
}
