"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { mobileNavItems } from "@/src/lib/nav-items";

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur px-2 py-2 flex justify-around">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition ${
              isActive ? "text-accent-dawn" : "text-muted"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
      <Link
        href="/more"
        className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition ${
          pathname === "/more" ? "text-accent-dawn" : "text-muted"
        }`}
      >
        <MoreHorizontal size={20} />
        More
      </Link>
    </nav>
  );
}
