import prismaClient from "./prismaClient";

import { AddJournalEntryFunction } from "@/types/journal_entry";
import { materialTypeMapToDB, materialTypeMapFromDB } from "@/types/material";

export const addJournalEntry: AddJournalEntryFunction = async function (
  dataToAddJE
) {
  try {
    const dbJournalEntry = await prismaClient.journalEntry.create({
      data: {
        ...dataToAddJE,
        material: {
          create: {
            ...dataToAddJE.material,
            type: materialTypeMapToDB[dataToAddJE.material.type],
          },
        },
        tags: {
          connect: dataToAddJE.tagIDs.map((id) => ({ id })),
        },
        date: {
          connect: {
            id: dataToAddJE.date.id,
          },
        },
      },
      include: {
        material: true,
        tags: true,
        date: true,
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...dbJournalEntry,
        material: {
          ...dbJournalEntry.material,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
        },
        tags: dbJournalEntry.tags.map((tag) => tag.name),
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};
