"use client";

import { Sparkles } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";

export default function CoachPage() {
  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="font-display italic text-3xl mb-6">Coach</h1>
        <div className="flex flex-col items-center justify-center text-center gap-3 p-10 rounded-2xl border border-border bg-surface pop-in">
          <div className="w-12 h-12 rounded-full bg-dawn-gradient flex items-center justify-center glow-dawn">
            <Sparkles size={20} className="text-[#0b0d12]" />
          </div>
          <p className="text-sm font-medium">Your AI coach is warming up</p>
          <p className="text-sm text-muted max-w-xs">
            Soon it'll check in on your habits, planner, and journal — and nudge you toward the next best thing.
          </p>
        </div>
      </div>
    </ProtectedShell>
  );
}
