export type Habit = {
  id: string;
  name: string;
  icon: string; // emoji, e.g. "💧"
  createdAt: number;
};

export type NewHabit = {
  name: string;
  icon: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean;
};
