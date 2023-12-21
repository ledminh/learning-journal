import { DataToCreateMaterial, Material, MaterialType } from "./material";
import { AsyncFunction } from "@/data/types";

import * as dbServer from "@/data/db_server/types";

/*****************************
 * Data
 */

export type DataToCreateJournalEntry = {
  title: string;
  tags: string[];
  description: string;
  material: DataToCreateMaterial;
  content: string;
};

export type JournalEntry = Omit<DataToCreateJournalEntry, "material"> & {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
};

/*****************************
 * Functions
 */

export type ConvertJournalEntryFromDBServerFunction = (
  dbServerJournalEntry: dbServer.JournalEntry
) => JournalEntry;
