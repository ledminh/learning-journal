import { AsyncFunction } from "@/data/types";
import { JournalEntry } from "./journal_entry";

/************************
 * Data
 */

export type Tag = {
  id: string;
  name: string;
  createdAt: Date;
  journalEntries: JournalEntry[];
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE ******************/
export type CreateTagsFunction = AsyncFunction<
  {
    name: string;
  }[],
  Tag[]
>;

/******** READ **********************/
export type GetTagFunction = AsyncFunction<
  {
    id: string;
    journalEntryLimit?: number;
    journalEntryOffset?: number;
    journalEntryFilters?: {
      keyword?: string;
      date?: Date;
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
    limit?: number;
    offset?: number;
    filters?: {
      keyword?: string;
    };
    sort?: {
      by?: "name";
      order?: "asc" | "desc";
    };
  },
  Tag[]
>;

/******** UPDATE **********************/
export type UpdateTagFunction = AsyncFunction<Tag, Tag>;

/******** DELETE **********************/
export type DeleteTagFunction = AsyncFunction<
  {
    id: string;
  },
  Tag
>;
