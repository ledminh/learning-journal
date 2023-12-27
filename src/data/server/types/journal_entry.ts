import { DataToCreateMaterial, Material } from "./material";

import * as dbServer from "@/data/db_server/types";

/*****************************
 * Data
 */

export type DataToConnectTag =
  | {
      name: string;
      id: null;
    }
  | {
      name: null;
      id: string;
    };

export type DataToCreateJournalEntry = {
  title: string;
  tags: DataToConnectTag[];
  description: string;
  material: DataToCreateMaterial;
  content: string;
};

export type JournalEntry = Omit<
  DataToCreateJournalEntry,
  "material" | "tags"
> & {
  id: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  material: Material;
  tags: string[];
};

/*****************************
 * Functions
 */

export type ConvertJournalEntryFromDBServerFunction = (
  dbServerJournalEntry: dbServer.JournalEntry
) => JournalEntry;
