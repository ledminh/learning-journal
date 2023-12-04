import type { JournalEntry } from "@/types/journal_entry";
import type { AsyncFunction } from ".";

/***************
 * Data
 */

export type TagEntry = {
  tag: string;
  entries: JournalEntry[];
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE **********************/

export type CreateTagFunction = AsyncFunction<{ name: string }, TagEntry>;

/******** READ **********************/

// Get a single tag entry with all of its journal entries.
// The options are for filtering and sorting the journal entries.
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

// Get all tag entries with/without their journal entries.
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
