"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProtectedShell from "@/src/components/ui/ProtectedShell";
import { navItems, mobileNavItems } from "@/src/lib/nav-items";

export default function MorePage() {
  const mobileHrefs = new Set(mobileNavItems.map((i) => i.href));
  const rest = navItems.filter((i) => !mobileHrefs.has(i.href));

  return (
    <ProtectedShell>
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="font-display italic text-3xl mb-6">More</h1>
        <div className="flex flex-col gap-1">
          {rest.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:border-neutral-600 transition"
              >
                <Icon size={18} className="text-muted" />
                <span className="flex-1 text-sm">{item.label}</span>
                <ChevronRight size={16} className="text-muted" />
              </Link>
            );
          })}
        </div>
      </div>
    </ProtectedShell>
  );
}
