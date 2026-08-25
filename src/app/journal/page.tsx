"use client";

import ProtectedShell from "@/src/components/ui/ProtectedShell";
import JournalForm from "@/src/components/ui/JournalForm";
import { useJournal } from "@/src/hooks/useJournal";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function JournalPage() {
  const today = todayString();
  const { entry } = useJournal(today);

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display italic text-3xl mb-1">Daily Journal</h1>
          <p className="text-sm text-muted">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {entry && " · Entry saved"}
          </p>
        </div>

        <JournalForm date={today} />
      </div>
    </ProtectedShell>
  );
}
