/************************
 * Data
 */

import { AsyncFunction } from ".";

enum MaterialType {
  Link = "link",
  Quote = "quote",
  Code = "code",
  Image = "image",
}

export type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  material: {
    type: MaterialType;
    content: string;
  };
  content: string;
};

/************************************************
 * SERVER and CLIENT functions: CRUD
 ************************************************/

/******** CREATE **********************/

export type CreateJournalEntryFunction = AsyncFunction<
  Omit<JournalEntry, "id" | "slug">,
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
      date?: string;
      materialType?: MaterialType;
      keyword?: string;
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

/************************************************
 * API functions
 ************************************************/

// UpoadImage
export type UploadImageAPIResponse = {
  url: string;
};

export type UploadImageFunction = AsyncFunction<
  {
    image: File;
  },
  UploadImageAPIResponse
>;

// GenerateJournalEntryDescription

export type DataToGenerateJournalEntryDescription = {
  title: string;
  content: string;
  material: {
    type: MaterialType;
    content: string;
  };
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
