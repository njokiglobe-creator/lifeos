export type JournalEntry = {
  date: string; // "YYYY-MM-DD", also used as the doc ID
  wentWell: string;
  challenged: string;
  grateful: string;
  biggestWin: string;
  improveTomorrow: string;
  updatedAt: number;
};

export type JournalEntryInput = Omit<JournalEntry, "date" | "updatedAt">;
