"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { useJournal } from "@/src/hooks/useJournal";

function emptyForm() {
  return {
    wentWell: "",
    challenged: "",
    grateful: "",
    biggestWin: "",
    improveTomorrow: "",
  };
}

const PROMPTS: { key: keyof ReturnType<typeof emptyForm>; label: string }[] = [
  { key: "wentWell", label: "What went well?" },
  { key: "challenged", label: "What challenged me?" },
  { key: "grateful", label: "What am I grateful for?" },
  { key: "biggestWin", label: "Biggest win today" },
  { key: "improveTomorrow", label: "One improvement tomorrow" },
];

export default function JournalForm({ date }: { date: string }) {
  const { entry, loading, saveEntry } = useJournal(date);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setForm(
      entry
        ? {
            wentWell: entry.wentWell,
            challenged: entry.challenged,
            grateful: entry.grateful,
            biggestWin: entry.biggestWin,
            improveTomorrow: entry.improveTomorrow,
          }
        : emptyForm()
    );
  }, [entry]);

  const handleChange = (key: keyof ReturnType<typeof emptyForm>, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveEntry(form);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const hasAnyContent = Object.values(form).some((v) => v.trim().length > 0);

  if (loading) {
    return <p className="text-sm text-muted">Loading journal...</p>;
  }

  return (
    <div className="flex flex-col gap-5 stagger">
      {PROMPTS.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
          <textarea
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
            rows={3}
            placeholder="Write a few thoughts..."
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted outline-none focus:border-accent-dawn/50 transition resize-none"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving || !hasAnyContent}
        className="self-end flex items-center gap-1.5 bg-dawn-gradient text-[#0b0d12] text-sm font-medium px-5 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-40"
      >
        {justSaved ? (
          <>
            <Check size={16} />
            Saved
          </>
        ) : saving ? (
          "Saving..."
        ) : (
          "Save Entry"
        )}
      </button>
    </div>
  );
}
