export type Project = {
  id: string;
  name: string;
  goal?: string;
  revenue: number;
  progress: number; // 0-100
  deadline?: string; // "YYYY-MM-DD"
  createdAt: number;
};

export type NewProject = {
  name: string;
  goal?: string;
  revenue?: number;
  deadline?: string;
};
