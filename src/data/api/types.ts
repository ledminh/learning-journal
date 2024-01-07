import {
  MaterialLinkContent,
  MaterialType,
} from "@/data/server/types/material";
import { Tag } from "@/data/server/types/tag";
import { AsyncFunction } from "@/data/types";
import { DateEntry } from "../server/types/date";
import {
  DataToConnectTag,
  DataToCreateJournalEntry,
  JournalEntry,
} from "@/data/server/types/journal_entry";

/**************************
 * Journal Entry API
 */
export type GetJournalEntriesFunction = AsyncFunction<
  {
    limit?: number;
    offset?: number;
    filters?: {
      materialType?: MaterialType;
      keyword?: string;
    };
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
  },
  {
    journalEntries: JournalEntry[];
    total: number;
  }
>;

export type GetJournalEntryFunction = AsyncFunction<
  {
    slug: string;
  },
  JournalEntry
>;

export type AddJournalEntryFunction = AsyncFunction<
  DataToCreateJournalEntry,
  JournalEntry
>;

export type UpdateJournalEntryFunction = AsyncFunction<
  {
    id: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    tags: DataToConnectTag[];

    material:
      | { id: string }
      | (
          | {
              id: null;
              type: MaterialType.QUOTE | MaterialType.CODE;
              content: string;
            }
          | {
              id: null;
              type: MaterialType.LINK;
              content: MaterialLinkContent;
            }
          | {
              id: null;
              type: MaterialType.IMAGE;
              content: File;
            }
        );
  },
  JournalEntry
>;

export type DeleteJournalEntryFunction = AsyncFunction<
  JournalEntry,
  {
    success: boolean;
  }
>;

/**************************
 * Date API
 */

export type GetDateFunction = AsyncFunction<
  {
    date: Date;
  },
  DateEntry
>;

/**************************
 * Tag API
 */
export type GetTagsFunction = AsyncFunction<
  {
    limit?: number;
  },
  Tag[]
>;

export type GetTagFunction = AsyncFunction<
  {
    slug: string;
    limit?: number;
    offset?: number;
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
    filters?: {
      materialType?: MaterialType;
      keyword?: string;
    };
  },
  {
    tag: Tag;
    numJournalEntries: number;
  }
>;

export type AddTagsFunction = AsyncFunction<
  {
    names: string[];
  },
  Tag[]
>;

export type UpdateTagFunction = AsyncFunction<
  {
    name: string;
    newName: string;
  },
  Tag
>;

export type EmptyTagFunction = AsyncFunction<
  {
    name: string;
  },
  Tag
>;

export type DeleteTagFunction = AsyncFunction<
  {
    name: string;
  },
  Tag
>;
