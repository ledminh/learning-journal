import type { JournalEntry } from "@/data/db_server/types/journal_entry";
import type { AsyncFunction } from "@/data/types";
import { MaterialType } from "./material";

/***************
 * Data
 */

export type TagEntry = {
  id: string;
  name: string;
  slug: string;
  journalEntries: JournalEntry[];
  createdAt: Date;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE and ADD **********************/

export type DataToCreateTags = { name: string }[];

export type DataToAddTags = Omit<
  TagEntry,
  "id" | "journalEntries" | "createdAt"
>[];

export type CreateTagFunction = AsyncFunction<DataToCreateTags, DataToAddTags>;
export type AddTagsFunction = AsyncFunction<DataToAddTags, TagEntry[]>;

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
        materialType?: MaterialType;
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
