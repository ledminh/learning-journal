import prismaClient from "./prismaClient";

import {
  AddJournalEntryFunction,
  GetJournalEntryFunction,
  GetJournalEntriesFunction,
  UpdateJournalEntryFunction,
  DeleteJournalEntryFunction,
} from "@/types/journal_entry";
import { materialTypeMapToDB, materialTypeMapFromDB } from "@/types/material";
import { getDate } from "./date";

/******** ADD ******************/

export const addJournalEntry: AddJournalEntryFunction = async function (
  dataToAddJE
) {
  try {
    const dbJournalEntry = await prismaClient.journalEntry.create({
      data: {
        title: dataToAddJE.title,
        slug: dataToAddJE.slug,
        description: dataToAddJE.description,
        content: dataToAddJE.content,

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
        id: dbJournalEntry.id,
        createdAt: dbJournalEntry.createdAt,
        updatedAt: dbJournalEntry.updatedAt,
        title: dbJournalEntry.title,
        slug: dbJournalEntry.slug,
        tags: dbJournalEntry.tags.map((tag) => tag.name),
        description: dbJournalEntry.description,
        material: {
          id: dbJournalEntry.material.id,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
          content: dbJournalEntry.material.content,
          createdAt: dbJournalEntry.material.createdAt,
        },
        content: dbJournalEntry.content,
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
        id: dbJournalEntry.id,
        createdAt: dbJournalEntry.createdAt,
        updatedAt: dbJournalEntry.updatedAt,
        title: dbJournalEntry.title,
        slug: dbJournalEntry.slug,
        tags: dbJournalEntry.tags.map((tag) => tag.name),
        description: dbJournalEntry.description,
        material: {
          id: dbJournalEntry.material.id,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
          content: dbJournalEntry.material.content,
          createdAt: dbJournalEntry.material.createdAt,
        },
        content: dbJournalEntry.content,
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
    let dateID: null | string = null;

    if (filters?.date) {
      const dbDate = await getDate({ date: filters.date });

      if (dbDate.errorMessage) {
        throw new Error(dbDate.errorMessage);
      }

      if (dbDate.payload === null) {
        return {
          errorMessage: null,
          payload: [],
        };
      }

      dateID = dbDate.payload.id;
    }

    const dbJournalEntries = await prismaClient.journalEntry.findMany({
      take: limit,
      skip: offset,
      where: {
        AND: [
          filters?.date
            ? {
                dateEntryId: dateID,
              }
            : {},
          filters?.materialType
            ? {
                material: {
                  type: materialTypeMapToDB[filters.materialType],
                },
              }
            : {},
          filters?.keyword
            ? {
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
              }
            : {},
        ],
      },
      orderBy: !sort
        ? [{ title: "asc" }, { createdAt: "asc" }]
        : sort.by === "title"
        ? { title: sort.order }
        : sort.by === "date"
        ? { createdAt: sort.order }
        : {},

      include: {
        material: true,
        tags: true,
        date: true,
      },
    });

    return {
      errorMessage: null,
      payload: dbJournalEntries.map((dbJournalEntry) => ({
        id: dbJournalEntry.id,
        createdAt: dbJournalEntry.createdAt,
        updatedAt: dbJournalEntry.updatedAt,
        title: dbJournalEntry.title,
        slug: dbJournalEntry.slug,
        tags: dbJournalEntry.tags.map((tag) => tag.name),
        description: dbJournalEntry.description,
        material: {
          id: dbJournalEntry.material.id,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
          content: dbJournalEntry.material.content,
          createdAt: dbJournalEntry.material.createdAt,
        },
        content: dbJournalEntry.content,
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
        id: dataToUpdateJE.id,
        title: dataToUpdateJE.title,
        slug: dataToUpdateJE.slug,
        description: dataToUpdateJE.description,
        content: dataToUpdateJE.content,
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
        id: dbJournalEntry.id,
        createdAt: dbJournalEntry.createdAt,
        updatedAt: dbJournalEntry.updatedAt,
        title: dbJournalEntry.title,
        slug: dbJournalEntry.slug,
        tags: dbJournalEntry.tags.map((tag) => tag.name),
        description: dbJournalEntry.description,
        material: {
          id: dbJournalEntry.material.id,
          type: materialTypeMapFromDB[dbJournalEntry.material.type],
          content: dbJournalEntry.material.content,
          createdAt: dbJournalEntry.material.createdAt,
        },
        content: dbJournalEntry.content,
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};

/******** DELETE **********************/

export const deleteJournalEntry: DeleteJournalEntryFunction = async function ({
  id,
}) {
  try {
    const dbJournalEntry = await prismaClient.journalEntry.delete({
      where: {
        id,
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
