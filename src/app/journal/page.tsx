"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { useJournal } from "@/src/hooks/useJournal";

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const PROMPTS: { key: keyof ReturnType<typeof emptyForm>; label: string }[] = [
  { key: "wentWell", label: "What went well?" },
  { key: "challenged", label: "What challenged me?" },
  { key: "grateful", label: "What am I grateful for?" },
  { key: "biggestWin", label: "Biggest win today" },
  { key: "improveTomorrow", label: "One improvement tomorrow" },
];

function emptyForm() {
  return {
    wentWell: "",
    challenged: "",
    grateful: "",
    biggestWin: "",
    improveTomorrow: "",
  };
}

export default function JournalPage() {
  const today = todayString();
  const { entry, loading, saveEntry } = useJournal(today);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (entry) {
      setForm({
        wentWell: entry.wentWell,
        challenged: entry.challenged,
        grateful: entry.grateful,
        biggestWin: entry.biggestWin,
        improveTomorrow: entry.improveTomorrow,
      });
    }
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

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1">Daily Journal</h1>
          <p className="text-sm text-neutral-400">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            {entry && " · Entry saved"}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : (
          <div className="flex flex-col gap-5">
            {PROMPTS.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  {label}
                </label>
                <textarea
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={3}
                  placeholder="Write a few thoughts..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition resize-none"
                />
              </div>
            ))}

            <button
              onClick={handleSave}
              disabled={saving || !hasAnyContent}
              className="self-end flex items-center gap-1.5 bg-white text-black text-sm font-medium px-5 py-2 rounded-lg hover:bg-neutral-200 transition disabled:opacity-40"
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
        )}
      </div>
    </ProtectedShell>
  );
}
