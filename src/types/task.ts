export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time?: string; // "14:30" optional time block
  priority: TaskPriority;
  completed: boolean;
  createdAt: number; // Date.now() timestamp
};

export type NewTask = Omit<Task, "id" | "createdAt" | "completed">;