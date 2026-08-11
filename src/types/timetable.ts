export type TimetableBlock = {
  id: string;
  time: string; // "HH:MM", 24-hour, zero-padded
  label: string;
};

export type NewTimetableBlock = {
  time: string;
  label: string;
};
