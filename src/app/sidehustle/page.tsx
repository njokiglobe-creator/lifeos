"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useProjects } from "@/src/hooks/useProjects";

export default function SideHustlePage() {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await addProject({ name: name.trim(), goal: goal.trim() || undefined, deadline: deadline || undefined });
      setName("");
      setGoal("");
      setDeadline("");
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display italic text-3xl mb-1">Side Hustle</h1>
            <p className="text-sm text-muted">
              {projects.length > 0 ? `${projects.length} active project${projects.length > 1 ? "s" : ""}` : "No projects yet"}
            </p>
          </div>
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add project"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3 p-4 rounded-xl border border-border bg-surface pop-in">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted" autoFocus />
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Goal (optional)" className="w-full bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm placeholder:text-muted" />
            <div className="flex items-center gap-2">
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-surface-raised border border-border rounded-lg px-3 py-1.5 text-sm text-foreground" />
              <button type="submit" disabled={submitting} className="ml-auto bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-4 py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-40">Add</button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-muted">No projects yet — add one above.</p>
        ) : (
          <div className="flex flex-col gap-3 stagger">
            {projects.map((project) => (
              <div key={project.id} className="group p-4 rounded-xl border border-border bg-surface card-hover transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{project.name}</p>
                    {project.goal && <p className="text-xs text-muted">{project.goal}</p>}
                  </div>
                  <button onClick={() => deleteProject(project.id)} className="text-muted hover:text-accent-danger transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="w-full h-1.5 bg-surface-raised rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-accent-dusk transition-all" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>{project.progress}% complete{project.deadline && ` · Due ${project.deadline}`}</span>
                  <div className="flex items-center gap-2">
                    <span>Revenue: ${project.revenue}</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      defaultValue={project.progress}
                      onMouseUp={(e) => updateProject(project.id, { progress: Number((e.target as HTMLInputElement).value) })}
                      onTouchEnd={(e) => updateProject(project.id, { progress: Number((e.target as HTMLInputElement).value) })}
                      className="w-20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedShell>
  );
}
