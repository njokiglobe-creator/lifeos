import {
  Home,
  CalendarClock,
  CheckSquare,
  BookOpen,
  Briefcase,
  Trophy,
  CalendarDays,
  NotebookPen,
  Sparkles,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: "Today", href: "/timetable", icon: Home },
  { label: "Planner", href: "/planner", icon: CalendarClock },
  { label: "Habits", href: "/habits", icon: CheckSquare },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Coach", href: "/coach", icon: Sparkles },
  { label: "Reading", href: "/reading", icon: BookOpen },
  { label: "Side Hustle", href: "/sidehustle", icon: Briefcase },
  { label: "Hockey", href: "/hockey", icon: Trophy },
  { label: "Journal", href: "/journal", icon: NotebookPen },
  { label: "Stats", href: "/stats", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const mobileNavItems: NavItem[] = [
  navItems[0], // Today
  navItems[2], // Habits
  navItems[3], // Events
  navItems[4], // Coach
];
