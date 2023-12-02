import type { JournalEntry } from "@/journal_entry/type";

/************************
 * Data
 */

export type DateEntry = {
  date: string;
  entries: JournalEntry[];
};

/***********************
 * Functions
 */
export type GetDateEntryFunction = (
  date: string,
  options?: {
    limit?: number;
    offset?: number;
    filters?: {
      tag?: string;
      materialType?: string;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  }
) => DateEntry;

export type GetDateEntriesFunction = (options?: {
  limit?: number;
  offset?: number;
  filters?: {
    tag?: string;
    materialType?: string;
    keyword?: string;
  };
  sort?: {
    by?: "date" | "title";
    order?: "asc" | "desc";
  };
}) => DateEntry[];
