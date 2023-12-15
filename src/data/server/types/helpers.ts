import { AsyncFunction } from "@/data/types";
import { MaterialLinkContent, MaterialType } from "./material";
import * as dbServer from "@/data/db_server/types";
import { JournalEntry } from "./journal_entry";

export type UploadImageFunction = AsyncFunction<
  { imageFile: File },
  { imageUrl: string }
>;

export type DeleteImageFunction = AsyncFunction<
  { imageUrl: string },
  {
    success: boolean;
  }
>;

export type GenerateMaterialLinkContentFunction = AsyncFunction<
  { url: string },
  MaterialLinkContent
>;

export type ConvertJournalEntryFromDBServerFunction = AsyncFunction<
  dbServer.JournalEntry,
  JournalEntry
>;

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  {
    title: string;
    content: string;
    material: MaterialType;
  },
  {
    description: string;
  }
>;
