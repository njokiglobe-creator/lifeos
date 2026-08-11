"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/src/lib/nav-items";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 h-screen sticky top-0 border-r border-border px-4 py-6 bg-surface/40">
      <div className="mb-8 px-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-dawn-gradient shrink-0" />
        <span className="font-display italic text-lg tracking-tight">LifeOS</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-surface-raised text-foreground"
                  : "text-muted hover:bg-surface-raised/60 hover:text-foreground"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-dawn-gradient" />
              )}
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
