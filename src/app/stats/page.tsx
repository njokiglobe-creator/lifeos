"use client";

import ProtectedShell from "@/src/components/ui/ProtectedShell";
import DawnRing from "@/src/components/ui/DawnRing";
import { useTasks } from "@/src/hooks/useTasks";
import { useHabits, useHabitLogs } from "@/src/hooks/useHabits";
import { useJournal } from "@/src/hooks/useJournal";
import { useTimetableWeek } from "@/src/hooks/useTimetable";
import { calculateDisciplineScore } from "@/src/lib/discipline-score";
import { SCHEDULE } from "@/src/lib/schedule";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}

export default function StatsPage() {
  const today = todayString();
  const weekDateStrings = getWeekDates();

  const { tasks, loading: tasksLoading } = useTasks(today);
  const { habits, loading: habitsLoading } = useHabits();
  const { logs, loading: logsLoading } = useHabitLogs(today);
  const { entry, loading: journalLoading } = useJournal(today);
  const { weekData, loading: weekLoading } = useTimetableWeek(
    weekDateStrings[0],
    weekDateStrings[6]
  );

  const loading = tasksLoading || habitsLoading || logsLoading || journalLoading || weekLoading;
  const todayTimetableCompletions = weekData[today] || {};

  const score = calculateDisciplineScore({
    tasks,
    habits,
    habitLogs: logs,
    journaled: !!entry,
    timetableCompletions: todayTimetableCompletions,
    timetableTotal: SCHEDULE.length,
  });

  const totalSkipped = weekDateStrings.reduce((sum, dateStr) => {
    const dayCompletions = weekData[dateStr] || {};
    return sum + Object.values(dayCompletions).filter((s) => s === "skipped").length;
  }, 0);
  const totalDone = weekDateStrings.reduce((sum, dateStr) => {
    const dayCompletions = weekData[dateStr] || {};
    return sum + Object.values(dayCompletions).filter((s) => s === "done").length;
  }, 0);
  const totalPossible = Math.max(0, SCHEDULE.length * 7 - totalSkipped);
  const weeklyPct = totalPossible === 0 ? 0 : Math.round((totalDone / totalPossible) * 100);

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display italic text-3xl mb-1">Statistics</h1>
          <p className="text-sm text-muted">Today's snapshot</p>
        </div>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-surface mb-6">
              <DawnRing score={score.total} />
              <p className="text-sm text-muted text-center max-w-xs mt-4">
                {score.total >= 80
                  ? "Excellent consistency today. Keep it going."
                  : score.total >= 50
                  ? "Solid progress — a few more small wins to go."
                  : "Every bit counts. What's one next best thing you can do?"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="text-xs text-muted mb-1">Timetable</p>
                <p className="text-lg font-mono">
                  {score.timetableCompleted}/{score.timetableTotal}
                </p>
                <p className="text-xs text-muted">{score.timetableScore} pts</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="text-xs text-muted mb-1">Tasks</p>
                <p className="text-lg font-mono">
                  {score.tasksCompleted}/{score.tasksTotal || 0}
                </p>
                <p className="text-xs text-muted">{score.tasksScore} pts</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="text-xs text-muted mb-1">Habits</p>
                <p className="text-lg font-mono">
                  {score.habitsCompleted}/{score.habitsTotal || 0}
                </p>
                <p className="text-xs text-muted">{score.habitsScore} pts</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="text-xs text-muted mb-1">Journal</p>
                <p className="text-lg font-mono">{score.journaled ? "Done" : "Not yet"}</p>
                <p className="text-xs text-muted">{score.journalScore} pts</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-surface mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted uppercase tracking-wide">
                  Weekly Timetable Completion
                </p>
                <span className="text-sm font-mono text-accent-dusk">{weeklyPct}%</span>
              </div>
              <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden">
                <div className="h-full bg-dawn-gradient transition-all" style={{ width: `${weeklyPct}%` }} />
              </div>
              <p className="text-xs text-muted mt-2">
                {totalDone} of {totalPossible} scheduled blocks completed this week
              </p>
            </div>

            {habits.length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="text-xs text-muted mb-3 uppercase tracking-wide">Today's Habits</p>
                <div className="flex flex-col gap-2">
                  {habits.map((h) => {
                    const done = logs.find((l) => l.habitId === h.id)?.completed ?? false;
                    return (
                      <div key={h.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span>{h.icon}</span>
                          {h.name}
                        </span>
                        <span className={done ? "text-accent-success" : "text-muted"}>
                          {done ? "✓ Done" : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedShell>
  );
}
