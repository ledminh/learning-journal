import prismaClient from "./prismaClient";

import {
  AddJournalEntryFunction,
  GetJournalEntryFunction,
  GetJournalEntriesFunction,
  UpdateJournalEntryFunction,
} from "@/types/journal_entry";
import { materialTypeMapToDB, materialTypeMapFromDB } from "@/types/material";

/******** ADD ******************/

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

/******** READ ******************/

export const getJournalEntry: GetJournalEntryFunction = async function ({
  slug,
}) {
  try {
    const dbJournalEntry = await prismaClient.journalEntry.findUnique({
      where: {
        slug,
      },
      include: {
        material: true,
        tags: true,
        date: true,
      },
    });

    if (!dbJournalEntry) {
      throw new Error("Journal entry not found.");
    }

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

export const getJournalEntries: GetJournalEntriesFunction = async function ({
  limit,
  offset,
  filters,
  sort,
}) {
  try {
    const dbJournalEntries = await prismaClient.journalEntry.findMany({
      take: limit,
      skip: offset,
      where: {
        ...(filters?.date && {
          createdAt: {
            equals: filters.date,
          },
        }),
        ...(filters?.materialType && {
          material: {
            type: materialTypeMapToDB[filters.materialType],
          },
        }),
        ...(filters?.keyword && {
          OR: [
            {
              title: {
                contains: filters.keyword,
              },
            },
            {
              description: {
                contains: filters.keyword,
              },
            },
            {
              content: {
                contains: filters.keyword,
              },
            },
          ],
        }),
      },
      orderBy: {
        ...(sort?.by === "title" && {
          title: sort.order,
        }),
        ...(sort?.by === "date" && {
          dateCreated: sort.order,
        }),
      },
      include: {
        material: true,
        tags: true,
        date: true,
      },
    });

    return {
      errorMessage: null,
      payload: dbJournalEntries.map((dbJournalEntry) => ({
        ...dbJournalEntry,
        material: {
          ...dbJournalEntry.material,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
        },
        tags: dbJournalEntry.tags.map((tag) => tag.name),
      })),
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};

/******** UPDATE **********************/

export const updateJournalEntry: UpdateJournalEntryFunction = async function (
  dataToUpdateJE
) {
  try {
    const dbJournalEntry = await prismaClient.journalEntry.update({
      where: {
        id: dataToUpdateJE.id,
      },
      data: {
        ...dataToUpdateJE,
        material: {
          update: {
            ...dataToUpdateJE.material,
            type: materialTypeMapToDB[dataToUpdateJE.material.type],
          },
        },
        tags: {
          set: dataToUpdateJE.tagIDs.map((id) => ({ id })),
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
