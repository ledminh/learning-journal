/************************
 * Data
 */

import { AsyncFunction } from "@/data/types";
import { DataToAddMaterial, Material, MaterialType } from "./material";

export type JournalEntry = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  material: Material;
  content: string;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE and ADD to DB ******************/

export type DataToCreateJournalEntry = Omit<
  JournalEntry,
  "id" | "slug" | "createdAt" | "updatedAt"
>;

export type DataToAddJournalEntry = Omit<
  JournalEntry & {
    date: { id: string };
    tagIDs: string[];
  },
  "id" | "tags" | "createdAt" | "updatedAt" | "material"
> & {
  material: DataToAddMaterial;
};

export type CreateJournalEntryFunction = AsyncFunction<
  DataToCreateJournalEntry,
  DataToAddJournalEntry
>;

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
  JournalEntry[]
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

/************************************************
 * Preparing functions
 ************************************************/

// Upload Image
export type ImageAPIResponse = {
  url: string;
};

export type UploadImageFunction = AsyncFunction<
  {
    image: File;
  },
  ImageAPIResponse
>;

export type DeleteImageFunction = AsyncFunction<
  {
    url: string;
  },
  ImageAPIResponse
>;

// GenerateJournalEntryDescription

export type DataToGenerateJournalEntryDescription = {
  title: string;
  content: string;
  material: MaterialType;
};

export type GenerateJournalEntryDescriptionAPIResponse = {
  description: string;
};

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  DataToGenerateJournalEntryDescription,
  GenerateJournalEntryDescriptionAPIResponse
>;

/************************************************
 * HOOKS
 ************************************************/
