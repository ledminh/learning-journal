import type { JournalEntry } from "@/data/db_server/types/journal_entry";
import type { AsyncFunction } from "@/types";
import { MaterialType } from "./material";

/***************
 * Data
 */

export type DataToAddTag = {
  name: string;
  slug: string;
};

export type TagEntry = DataToAddTag & {
  id: string;
  journalEntries: JournalEntry[];
  createdAt: Date;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE and ADD **********************/

export type AddTagsFunction = AsyncFunction<DataToAddTag[], TagEntry[]>;

/******** READ **********************/

// Get a single tag entry with all of its journal entries.
// The options are for filtering and sorting the journal entries.

export type GetTagEntryFunction = AsyncFunction<
  {
    slug: string;
    options?: {
      limit?: number;
      offset?: number;
      filters?: {
        date?: Date;
        materialType?: MaterialType;
        keyword?: string;
      };
      sort?: {
        by?: "date" | "title";
        order?: "asc" | "desc";
      };
    };
  },
  {
    tag: TagEntry;
    numJournalEntries: number;
  }
>;

// Get all/some tag entries with/without their journal entries.
export type GetTagEntriesFunction = AsyncFunction<
  {
    names?: string[];
    options?: {
      limit?: number;
      offset?: number;
      filters?: {
        keyword?: string;
      };
      sort?: {
        by?: "name";
        order?: "asc" | "desc";
      };
    } & (
      | {
          includeJournalEntries?: false;
          journalEntryFilters?: {};
          journalEntrySort?: {};
        }
      | {
          includeJournalEntries: true;
          journalEntryFilters: {
            date?: Date;
            materialType?: MaterialType;
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
  { name: string; journalEntryID: string },
  TagEntry
>;

export type EmptyTagFunction = AsyncFunction<{ name: string }, TagEntry>;

/******** DELETE **********************/
export type DeleteTagFunction = AsyncFunction<{ name: string }, TagEntry>;
