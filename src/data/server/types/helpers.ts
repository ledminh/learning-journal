import { AsyncFunction } from "@/data/types";
import { MaterialLinkContent } from "./material";
import * as dbServer from "@/data/db_server/types";
import { JournalEntry } from "./journal_entry";

export type UploadImageFunction = AsyncFunction<
  { imageFile: File },
  { imageUrl: string }
>;

export type GenerateMaterialLinkContentFunction = AsyncFunction<
  { url: string },
  MaterialLinkContent
>;

export type ConvertJournalEntryFromDBServerFunction = AsyncFunction<
  dbServer.JournalEntry,
  JournalEntry
>;
