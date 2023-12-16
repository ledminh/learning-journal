import { AsyncFunction } from "@/data/types";
import { JournalEntry } from "./journal_entry";
import { MaterialType } from "./material";

/************************
 * Data
 */

export type DataToCreateTag = {
  name: string;
};

export type Tag = DataToCreateTag & {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntries: JournalEntry[];
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE ******************/
export type CreateTagsFunction = AsyncFunction<DataToCreateTag[], Tag[]>;

/******** READ **********************/
export type GetTagFunction = AsyncFunction<
  {
    name: string;
    journalEntryLimit?: number;
    journalEntryOffset?: number;
    journalEntryFilters?: {
      date?: Date;
      materialType?: MaterialType;
      keyword?: string;
    };
    journalEntrySort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  },
  Tag
>;

export type GetTagsFunction = AsyncFunction<
  {
    names?: string[];

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
  ),
  Tag[]
>;

/******** UPDATE **********************/
export type UpdateTagFunction = AsyncFunction<Tag, Tag>;
export type AddJournalEntryToTagFunction = AsyncFunction<
  { name: string; journalEntry: JournalEntry },
  Tag
>;

export type RemoveJournalEntryFromTagFunction = AsyncFunction<
  { name: string; journalEntryID: string },
  Tag
>;

export type EmptyTagFunction = AsyncFunction<{ name: string }, Tag>;

/******** DELETE **********************/
export type DeleteTagFunction = AsyncFunction<
  {
    name: string;
  },
  Tag
>;
