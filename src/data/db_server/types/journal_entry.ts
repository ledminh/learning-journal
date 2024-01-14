/************************
 * Data
 */

import { AsyncFunction } from "@/types";
import { DataToAddMaterial, Material, MaterialType } from "./material";

export type DataToAddJournalEntry = {
  title: string;
  slug: string;
  description: string;
  tagIDs: string[];
  material: DataToAddMaterial;
  content: string;
  date: { id: string };
};

export type JournalEntry = Omit<
  DataToAddJournalEntry,
  "material" | "tagIDs" | "date"
> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  material: Material;
};

/************************************************
 * CRUD
 ************************************************/

/******** ADD to DB ******************/

export type AddJournalEntryFunction = AsyncFunction<
  DataToAddJournalEntry,
  JournalEntry
>;

/******** READ **********************/

export type GetJournalEntryFunction = AsyncFunction<
  { slug: string },
  JournalEntry
>;

export type GetJournalEntriesFunction = AsyncFunction<
  {
    limit?: number;
    offset?: number;
    filters?: {
      keyword?: string;
      date?: Date;
      materialType?: MaterialType;
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

/******** UPDATE **********************/

export type DataToUpdateJournalEntry = Omit<
  JournalEntry & { tagIDs: string[] },
  "tags" | "createdAt" | "updatedAt"
>;

export type UpdateJournalEntryFunction = AsyncFunction<
  DataToUpdateJournalEntry,
  JournalEntry
>;

/******** DELETE **********************/
export type DeleteJournalEntryFunction = AsyncFunction<
  { id: string },
  JournalEntry
>;
