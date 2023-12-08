import { materialTypeMapToDB } from "@/types/material";
import prismaClient from "./prismaClient";

import {
  CreateAndAddDateEntryFunction,
  GetDateEntriesFunction,
  GetDateEntryFunction,
  DeleteDateEntryFunction,
} from "@/types/date";

/******** CREATE **********************/

export const createAndAddDate: CreateAndAddDateEntryFunction =
  async function () {
    try {
      const dbDate = await prismaClient.date.create({});

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
    const dbDate = await prismaClient.date.findUnique({
      where: {
        date: date,
      },
      include: {
        journalEntries: {
          include: {
            tags: true,
            material: true,
          },
          orderBy: {
            title: options?.sort?.order,
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
      throw new Error(`Date entry for ${date} not found.`);
    }

    return {
      errorMessage: null,
      payload: {
        ...dbDate,
        journalEntries: dbDate?.journalEntries.map((entry) => ({
          ...entry,
          tags: entry.tags.map((tag) => tag.name),
          material: {
            ...entry.material,
            type: entry.material.type as any,
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
        date: options?.sort?.order,
      },
    };

    // Not including journal entries
    if (!options?.includeJournalEntries) {
      const dbDates = await prismaClient.date.findMany(initOps);

      return {
        errorMessage: null,
        payload: dbDates.map((dbDate) => ({
          ...dbDate,
          journalEntries: [],
        })),
      };
    }

    // Including journal entries
    const dbDates = await prismaClient.date.findMany({
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
          orderBy: {
            title: options?.sort?.order,
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: dbDates.map((dbDate) => ({
        ...dbDate,
        journalEntries: dbDate?.journalEntries.map((entry) => ({
          ...entry,
          tags: entry.tags.map((tag) => tag.name),
          material: {
            ...entry.material,
            type: entry.material.type as any,
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
    const dbDate = await prismaClient.date.delete({
      where: {
        date: date,
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
