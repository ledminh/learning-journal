import { MaterialType as DBMaterialType } from "../db_server/types";

import {
  ConvertJournalEntryFromDBServerFunction,
  JournalEntry,
} from "./types/journal_entry";

import { materialTypeMapFromDBServer } from "./types/material";

export const convertJournalEntryFromDBServer: ConvertJournalEntryFromDBServerFunction =
  (dbJournalEntry) => {
    const materialContent =
      dbJournalEntry.material.type === DBMaterialType.Link
        ? JSON.parse(dbJournalEntry.material.content)
        : dbJournalEntry.material.content;

    const journalEntry: JournalEntry = {
      id: dbJournalEntry.id,
      slug: dbJournalEntry.slug,
      createdAt: dbJournalEntry.createdAt,
      updatedAt: dbJournalEntry.updatedAt,
      title: dbJournalEntry.title,
      description: dbJournalEntry.description,
      material: {
        id: dbJournalEntry.material.id,
        type: materialTypeMapFromDBServer[dbJournalEntry.material.type],
        content: materialContent,
      },
      content: dbJournalEntry.content,
      tags: dbJournalEntry.tags,
    };

    return journalEntry;
  };
