export type BookStatus = "reading" | "finished" | "wantToRead";

export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: BookStatus;
  notes?: string;
  createdAt: number;
};

export type NewBook = {
  title: string;
  author: string;
  totalPages: number;
  notes?: string;
};
