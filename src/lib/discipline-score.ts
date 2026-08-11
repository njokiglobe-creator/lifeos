import type { Task } from "@/src/types/task";
import type { Habit, HabitLog } from "@/src/types/habit";

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
  timetableCompletions: Record<string, boolean>;
  timetableTotal: number;
}): ScoreBreakdown {
  const timetableCompleted = Object.values(timetableCompletions).filter(Boolean).length;
  const timetableScore =
    timetableTotal === 0 ? 30 : Math.round((timetableCompleted / timetableTotal) * 30);

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
    timetableTotal,
    habitsCompleted,
    habitsTotal,
    tasksCompleted,
    tasksTotal,
    journaled,
  };
}
