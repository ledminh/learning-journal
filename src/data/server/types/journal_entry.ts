import { DataToCreateMaterial, Material, MaterialType } from "./material";
import { AsyncFunction } from "@/data/types";

/*****************************
 * Data
 */

export type DataToCreateJournalEntry = {
  title: string;
  slug: string;
  tags: string[];
  description: string;
  material: DataToCreateMaterial;
  content: string;
};

export type JournalEntry = Omit<DataToCreateJournalEntry, "material"> & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE ******************/
export type CreateJournalEntryFunction = AsyncFunction<
  DataToCreateJournalEntry,
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
  JournalEntry[]
>;

/******** UPDATE **********************/
export type UpdateJournalEntryFunction = AsyncFunction<
  JournalEntry,
  JournalEntry
>;

/******** DELETE **********************/
export type DeleteJournalEntryFunction = AsyncFunction<
  { id: string },
  JournalEntry
>;
