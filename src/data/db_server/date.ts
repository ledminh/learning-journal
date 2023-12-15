import {
  materialTypeMapToDB,
  materialTypeMapFromDB,
} from "@/data/db_server/types/material";

import prismaClient from "./prismaClient";

import {
  CreateAndAddDateEntryFunction,
  GetDateEntriesFunction,
  GetDateEntryFunction,
  DeleteDateEntryFunction,
} from "@/data/db_server/types/date";
import { getStartOfDate } from "@/utils/dateFunctions";

/******** CREATE **********************/

export const createAndAddDate: CreateAndAddDateEntryFunction = async function (
  options
) {
  try {
    const date = options?.date ?? new Date();

    const dbDate = await prismaClient.dateEntry.create({
      data: {
        date: getStartOfDate(date),
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...dbDate,
        journalEntries: [],
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};

/******** READ **********************/
export const getDate: GetDateEntryFunction = async function ({
  date,
  options,
}) {
  try {
    const dbDate = await prismaClient.dateEntry.findUnique({
      where: {
        date: getStartOfDate(date),
      },
      include: {
        journalEntries: {
          include: {
            tags: true,
            material: true,
          },
          orderBy: options?.sort
            ? {
                title: options?.sort?.order,
              }
            : {
                title: "asc",
              },
          take: options?.limit,
          skip: options?.offset,
          where: {
            AND: [
              options?.filters?.tag
                ? {
                    tags: {
                      some: {
                        name: options?.filters?.tag,
                      },
                    },
                  }
                : {},

              options?.filters?.materialType
                ? {
                    material: {
                      type: materialTypeMapToDB[options?.filters?.materialType],
                    },
                  }
                : {},
              options?.filters?.keyword
                ? {
                    OR: [
                      {
                        title: {
                          contains: options?.filters?.keyword,
                        },
                      },
                      {
                        description: {
                          contains: options?.filters?.keyword,
                        },
                      },
                      {
                        content: {
                          contains: options?.filters?.keyword,
                        },
                      },
                    ],
                  }
                : {},
            ],
          },
        },
      },
    });

    if (!dbDate) {
      return {
        errorMessage: null,
        payload: null,
      };
    }

    return {
      errorMessage: null,
      payload: {
        id: dbDate.id,
        date: dbDate.date,
        journalEntries: dbDate?.journalEntries.map((entry) => ({
          id: entry.id,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          title: entry.title,
          slug: entry.slug,
          description: entry.description,
          content: entry.content,
          tags: entry.tags.map((tag) => tag.name),
          material: {
            id: entry.material.id,
            createdAt: entry.material.createdAt,
            type: materialTypeMapFromDB[entry.material.type],
            content: entry.material.content,
          },
        })),
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};

export const getDates: GetDateEntriesFunction = async function ({ options }) {
  try {
    const initOps = {
      take: options?.limit,
      skip: options?.offset,
      orderBy: {
        date: options?.sort?.order ?? "asc",
      },
    };

    // Not including journal entries
    if (!options?.includeJournalEntries) {
      const dbDates = await prismaClient.dateEntry.findMany(initOps);

      return {
        errorMessage: null,
        payload: dbDates.map((dbDate) => ({
          ...dbDate,
          journalEntries: [],
        })),
      };
    }

    // Including journal entries
    const dbDates = await prismaClient.dateEntry.findMany({
      ...initOps,
      include: {
        journalEntries: {
          where: {
            AND: [
              options?.journalEntryFilters?.materialType
                ? {
                    material: {
                      type: materialTypeMapToDB[
                        options?.journalEntryFilters?.materialType
                      ],
                    },
                  }
                : {},
              options?.journalEntryFilters?.keyword
                ? {
                    OR: [
                      {
                        title: {
                          contains: options?.journalEntryFilters?.keyword,
                        },
                      },
                      {
                        description: {
                          contains: options?.journalEntryFilters?.keyword,
                        },
                      },
                      {
                        content: {
                          contains: options?.journalEntryFilters?.keyword,
                        },
                      },
                    ],
                  }
                : {},
            ],
          },
          include: {
            tags: true,
            material: true,
          },
          orderBy: options?.journalEntrySort
            ? {
                title: options?.journalEntrySort?.order,
              }
            : {
                title: "asc",
              },
        },
      },
    });

    return {
      errorMessage: null,
      payload: dbDates.map((dbDate) => ({
        ...dbDate,
        journalEntries: dbDate?.journalEntries.map((entry) => ({
          id: entry.id,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          title: entry.title,
          slug: entry.slug,
          description: entry.description,
          content: entry.content,
          tags: entry.tags.map((tag) => tag.name),
          material: {
            ...entry.material,
            type: materialTypeMapFromDB[entry.material.type],
          },
        })),
      })),
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};

/******** DELETE **********************/

export const deleteDate: DeleteDateEntryFunction = async function ({ date }) {
  try {
    const dbDate = await prismaClient.dateEntry.delete({
      where: {
        date: getStartOfDate(date),
      },
    });

    if (!dbDate) throw new Error(`Date entry for ${date} not found.`);

    return {
      errorMessage: null,
      payload: {
        ...dbDate,
        journalEntries: [],
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};
