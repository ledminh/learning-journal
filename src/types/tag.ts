import type { JournalEntry } from "@/types/journal_entry";

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
) => Promise<TagEntry>;

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
}) => Promise<TagEntry[]>;
