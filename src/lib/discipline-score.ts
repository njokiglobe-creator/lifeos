import type { Task } from "@/src/types/task";
import type { Habit, HabitLog } from "@/src/types/habit";
import type { TimetableStatus } from "@/src/types/timetable";

export type ScoreBreakdown = {
  total: number;
  timetableScore: number;
  habitsScore: number;
  tasksScore: number;
  journalScore: number;
  timetableCompleted: number;
  timetableTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  tasksCompleted: number;
  tasksTotal: number;
  journaled: boolean;
};

export function calculateDisciplineScore({
  tasks,
  habits,
  habitLogs,
  journaled,
  timetableCompletions,
  timetableTotal,
}: {
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  journaled: boolean;
  timetableCompletions: Record<string, TimetableStatus>;
  timetableTotal: number;
}): ScoreBreakdown {
  const statuses = Object.values(timetableCompletions);
  const timetableCompleted = statuses.filter((s) => s === "done").length;
  const timetableSkipped = statuses.filter((s) => s === "skipped").length;
  const timetableExpected = Math.max(0, timetableTotal - timetableSkipped);
  const timetableScore =
    timetableExpected === 0 ? 30 : Math.round((timetableCompleted / timetableExpected) * 30);

  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter((t) => t.completed).length;
  const tasksScore = tasksTotal === 0 ? 25 : Math.round((tasksCompleted / tasksTotal) * 25);

  const habitsTotal = habits.length;
  const habitsCompleted = habitLogs.filter((l) => l.completed).length;
  const habitsScore = habitsTotal === 0 ? 25 : Math.round((habitsCompleted / habitsTotal) * 25);

  const journalScore = journaled ? 20 : 0;

  const total = Math.min(100, timetableScore + tasksScore + habitsScore + journalScore);

  return {
    total,
    timetableScore,
    habitsScore,
    tasksScore,
    journalScore,
    timetableCompleted,
    timetableTotal: timetableExpected,
    habitsCompleted,
    habitsTotal,
    tasksCompleted,
    tasksTotal,
    journaled,
  };
}
