import type { JournalEntry } from "@/types/journal_entry";
import type { AsyncFunction } from ".";

/***************
 * Data
 */

export type TagEntry = {
  name: string;
  slug: string;
  entries: JournalEntry[];
  dateCreated: Date;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE **********************/

export type CreateTagFunction = AsyncFunction<{ name: string }, TagEntry>;

/******** READ **********************/

// Get a single tag entry with all of its journal entries.
// The options are for filtering and sorting the journal entries.

export type GetTagEntryFunction = AsyncFunction<
  {
    name: string;
    options?: {
      limit?: number;
      offset?: number;
      filters?: {
        date?: Date;
        materialType?: string;
        keyword?: string;
      };
      sort?: {
        by?: "date" | "title";
        order?: "asc" | "desc";
      };
    };
  },
  TagEntry
>;

// Get all tag entries with/without their journal entries.
export type GetTagEntriesFunction = AsyncFunction<
  {
    options?: {
      limit?: number;
      offset?: number;
      filters?: {
        date?: Date;
        keyword?: string;
      };
      sort?: {
        by?: "date" | "name";
        order?: "asc" | "desc";
      };
    } & (
      | {
          includeJournalEntries?: false;
          journalEntryFilters?: never;
          journalEntrySort?: never;
        }
      | {
          includeJournalEntries: true;
          journalEntryFilters: {
            date?: Date;
            materialType?: string;
            keyword?: string;
          };
          journalEntrySort: {
            by?: "date" | "title";
            order?: "asc" | "desc";
          };
        }
    );
  },
  TagEntry[]
>;

/******** UPDATE **********************/
export type UpdateTagFunction = AsyncFunction<TagEntry, TagEntry>;
export type AddJournalEntryToTagFunction = AsyncFunction<
  { name: string; journalEntry: JournalEntry },
  TagEntry
>;
export type RemoveJournalEntryFromTagFunction = AsyncFunction<
  { name: string; journalEntry: JournalEntry },
  TagEntry
>;

export type EmptyTagFunction = AsyncFunction<{ name: string }, TagEntry>;

/******** DELETE **********************/
export type DeleteTagFunction = AsyncFunction<{ name: string }, TagEntry>;
