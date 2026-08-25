"use client";

import { useState } from "react";
import { Plus, Trash2, Circle, CheckCircle2 } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useTasks } from "@/src/hooks/useTasks";
import type { TaskPriority } from "@/src/types/task";

function todayString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-red-500/15 text-red-400 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-surface-raised text-muted border-border",
};

export default function PlannerPage() {
  const today = todayString();
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks(today);

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        date: today,
        time: time || undefined,
        priority,
      });
      setTitle("");
      setTime("");
      setPriority("medium");
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display italic text-3xl mb-1">Daily Planner</h1>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {tasks.length > 0 && ` · ${completedCount}/${tasks.length} done`}
          </p>
        </div>

        {/* Add task form */}
        <form
          onSubmit={handleAdd}
          className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted"
          />
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="ml-auto flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-40"
            >
              <Plus size={16} />
              Add
            </button>
          </div>
        </form>

        {/* Task list */}
        {loading ? (
          <p className="text-sm text-muted">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted">
            Nothing planned yet — add your first task above.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 stagger">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl border border-border bg-surface card-hover transition ${
                  task.completed ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className="text-muted hover:text-foreground transition shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} className="text-accent-success" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      task.completed ? "line-through text-muted" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.time && (
                    <p className="text-xs text-muted mt-0.5">{task.time}</p>
                  )}
                </div>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${priorityStyles[task.priority]}`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-muted hover:text-accent-danger transition shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedShell>
  );
}