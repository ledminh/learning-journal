import { materialTypeMapToDB, materialTypeMapFromDB } from "@/types/material";
import prismaClient from "./prismaClient";

import {
  AddTagsFunction,
  DeleteTagFunction,
  EmptyTagFunction,
  GetTagEntriesFunction,
  GetTagEntryFunction,
  RemoveJournalEntryFromTagFunction,
  UpdateTagFunction,
} from "@/types/tag";
import { getEndOfDate, getStartOfDate } from "@/utils/dateFunctions";

/******** ADD or GET **********************/

export const addTags: AddTagsFunction = async (dataToAddTags) => {
  try {
    const { count } = await prismaClient.tag.createMany({
      data: dataToAddTags,
    });

    if (count !== dataToAddTags.length) {
      throw new Error("Error adding tags.");
    }

    const tags = await prismaClient.tag.findMany({
      where: {
        OR: dataToAddTags.map((tag) => ({
          name: tag.name,
        })),
      },
      include: {
        journalEntries: {
          include: {
            material: true,
            tags: true,
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: tags.map((tag) => ({
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      })),
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

export const getTag: GetTagEntryFunction = async ({ name, options }) => {
  try {
    const tag = await prismaClient.tag.findUnique({
      where: {
        name,
      },
      include: {
        journalEntries: {
          where: {
            AND: [
              options?.filters?.date
                ? {
                    createdAt: {
                      equals: options.filters.date,
                    },
                  }
                : {},
              options?.filters?.materialType
                ? {
                    material: {
                      type: materialTypeMapToDB[options.filters.materialType],
                    },
                  }
                : {},
              options?.filters?.keyword
                ? {
                    OR: [
                      {
                        title: {
                          contains: options.filters.keyword,
                        },
                      },
                      {
                        content: {
                          contains: options.filters.keyword,
                        },
                      },
                    ],
                  }
                : {},
            ],
          },
          include: {
            material: true,
            tags: true,
          },
          orderBy: [
            {
              createdAt:
                options?.sort?.by === "date" ? options.sort.order : "asc",
            },
            {
              title: options?.sort?.by === "title" ? options.sort.order : "asc",
            },
          ],
          take: options?.limit,
          skip: options?.offset,
        },
      },
    });

    if (!tag) {
      throw new Error("Tag not found.");
    }

    return {
      errorMessage: null,
      payload: {
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

export const getTags: GetTagEntriesFunction = async ({ names, options }) => {
  try {
    const initFindManyOptions = {
      take: options?.limit,
      skip: options?.offset,
      where: {
        ...(names?.length ? { name: { in: names } } : {}),
        AND: [
          options?.filters?.date
            ? {
                createdAt: {
                  gt: getStartOfDate(options.filters.date),
                  lt: getEndOfDate(options.filters.date),
                },
              }
            : {},
          options?.filters?.keyword
            ? {
                name: {
                  contains: options.filters.keyword,
                },
              }
            : {},
        ],
      },
      orderBy:
        options?.sort?.by === "name"
          ? {
              name: options.sort.order,
            }
          : options?.sort?.by === "date"
          ? {
              createdAt: options.sort.order,
            }
          : {},
    };

    // Not including journal entries.
    if (!options?.includeJournalEntries) {
      const tags = await prismaClient.tag.findMany(initFindManyOptions);

      return {
        errorMessage: null,
        payload: tags.map((tag) => ({
          ...tag,
          journalEntries: [],
        })),
      };
    }

    // Including journal entries.
    const tags = await prismaClient.tag.findMany({
      ...initFindManyOptions,
      include: {
        journalEntries: {
          where: {
            AND: [
              options?.journalEntryFilters?.date
                ? {
                    createdAt: {
                      equals: options.journalEntryFilters.date,
                    },
                  }
                : {},
              options?.journalEntryFilters?.materialType
                ? {
                    material: {
                      type: materialTypeMapToDB[
                        options.journalEntryFilters.materialType
                      ],
                    },
                  }
                : {},
              options?.journalEntryFilters?.keyword
                ? {
                    OR: [
                      {
                        title: {
                          contains: options.journalEntryFilters.keyword,
                        },
                      },
                      {
                        content: {
                          contains: options.journalEntryFilters.keyword,
                        },
                      },
                    ],
                  }
                : {},
            ],
          },
          include: {
            material: true,
            tags: true,
          },
          orderBy: {
            createdAt:
              options?.journalEntrySort?.by === "date"
                ? options.journalEntrySort.order
                : "asc",
            title:
              options?.journalEntrySort?.by === "title"
                ? options.journalEntrySort.order
                : "asc",
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: tags.map((tag) => ({
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      })),
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

/******** UPDATE **********************/
export const updateTag: UpdateTagFunction = async (dataToUpdateTag) => {
  try {
    const tag = await prismaClient.tag.update({
      where: {
        id: dataToUpdateTag.id,
      },
      data: {
        name: dataToUpdateTag.name,
        slug: dataToUpdateTag.slug,
      },
      include: {
        journalEntries: {
          include: {
            material: true,
            tags: true,
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

export const removeJournalEntryFromTag: RemoveJournalEntryFromTagFunction =
  async ({ name, journalEntry }) => {
    try {
      const tag = await prismaClient.tag.update({
        where: {
          name,
        },
        data: {
          journalEntries: {
            disconnect: {
              id: journalEntry.id,
            },
          },
        },
        include: {
          journalEntries: {
            include: {
              material: true,
              tags: true,
            },
          },
        },
      });

      return {
        errorMessage: null,
        payload: {
          ...tag,
          journalEntries: tag.journalEntries.map((journalEntry) => ({
            ...journalEntry,
            material: {
              ...journalEntry.material,
              type: materialTypeMapFromDB[journalEntry.material.type],
            },
            tags: journalEntry.tags.map((tag) => tag.name),
          })),
        },
      };
    } catch (error: any) {
      return {
        errorMessage: error.message,
        payload: null,
      };
    }
  };

export const emptyTag: EmptyTagFunction = async ({ name }) => {
  try {
    const jE = await prismaClient.journalEntry.findMany({
      where: {
        tags: {
          some: {
            name: name,
          },
        },
      },
    });

    const tag = await prismaClient.tag.update({
      where: {
        name,
      },
      data: {
        journalEntries: {
          disconnect: jE.map((journalEntry) => ({
            id: journalEntry.id,
          })),
        },
      },
      include: {
        journalEntries: {
          include: {
            material: true,
            tags: true,
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

/******** DELETE **********************/

export const deleteTag: DeleteTagFunction = async ({ name }) => {
  try {
    const tag = await prismaClient.tag.delete({
      where: {
        name,
      },
      include: {
        journalEntries: {
          include: {
            material: true,
            tags: true,
          },
        },
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...tag,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          ...journalEntry,
          material: {
            ...journalEntry.material,
            type: materialTypeMapFromDB[journalEntry.material.type],
          },
          tags: journalEntry.tags.map((tag) => tag.name),
        })),
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};
