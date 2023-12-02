import type { JournalEntry } from "@/journal_entry/type";

/***************
 * Data
 */

export type TagEntry = {
  tag: string;
  entries: JournalEntry[];
};

/****************
 * Functions
 */

export type GetTagEntryFunction = (
  tag: string,
  options?: {
    limit?: number;
    offset?: number;
    filters?: {
      date?: string;
      materialType?: string;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  }
) => TagEntry;

export type GetTagEntriesFunction = (options?: {
  limit?: number;
  offset?: number;
  includeJournalEntries?: boolean;
  filters?: {
    date?: string;
    materialType?: string;
    keyword?: string;
  };
  sort?: {
    by?: "date" | "title";
    order?: "asc" | "desc";
  };
}) => TagEntry[];
