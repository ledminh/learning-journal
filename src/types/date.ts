import type { JournalEntry } from "@/types/journal_entry";
import { AsyncFunction } from ".";
import { MaterialType } from "./material";

/************************
 * Data
 */

export type DateEntry = {
  date: Date;
  entries: JournalEntry[];
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE **********************/

export type CreateDateEntryFunction = AsyncFunction<undefined, DateEntry>;

/******** READ **********************/

// Get a single date entry with all of its journal entries.
// The options are for filtering and sorting the journal entries.

export type GetDateEntryFunction = AsyncFunction<
  {
    date: Date;
    options?: {
      limit?: number;
      offset?: number;
      filters?: {
        tag?: string;
        materialType?: MaterialType;
        keyword?: string;
      };
      sort?: {
        by: "title";
        order?: "asc" | "desc";
      };
    };
  },
  DateEntry
>;

// Get all date entries with/without their journal entries.

export type GetDateEntriesFunction = AsyncFunction<
  {
    options?: {
      limit?: number;
      offset?: number;
      sort?: {
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
            materialType?: MaterialType;
            keyword?: string;
          };
          journalEntrySort: {
            by: "title";
            order?: "asc" | "desc";
          };
        }
    );
  },
  DateEntry[]
>;

/******** UPDATE **********************/
export type AddJournalEntryToDateFunction = AsyncFunction<
  {
    date: Date;
    journalEntry: JournalEntry;
  },
  DateEntry
>;

export type DeleteJournalEntryFromDateFunction = AsyncFunction<
  {
    date: Date;
    journalEntry: JournalEntry;
  },
  DateEntry
>;

/******** DELETE **********************/
export type DeleteDateEntryFunction = AsyncFunction<
  {
    date: Date;
  },
  DateEntry
>;
