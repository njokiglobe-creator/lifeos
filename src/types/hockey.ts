export type HockeyEventType = "training" | "match" | "recovery" | "team";

export type HockeyEvent = {
  id: string;
  title: string;
  type: HockeyEventType;
  date: string;
  time?: string;
  opponent?: string;
  location?: string;
  notes?: string;
  createdAt: number;
};

export type NewHockeyEvent = {
  title: string;
  type: HockeyEventType;
  date: string;
  time?: string;
  opponent?: string;
  location?: string;
  notes?: string;
};
