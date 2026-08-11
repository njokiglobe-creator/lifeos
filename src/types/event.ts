export type EventCategory =
  | "Personal"
  | "Work"
  | "Sports"
  | "Travel"
  | "Health"
  | "Finance"
  | "Education"
  | "Custom";

export type EventPriority = "low" | "medium" | "high";

export type LifeEvent = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time?: string; // "14:30"
  location?: string;
  notes?: string;
  category: EventCategory;
  priority: EventPriority;
  createdAt: number;
};

export type NewLifeEvent = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
  category: EventCategory;
  priority: EventPriority;
};
