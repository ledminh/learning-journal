import { materialTypeMapToDB, materialTypeMapFromDB } from "@/types/material";
import prismaClient from "./prismaClient";

import {
  AddOrGetTagsFunction,
  DeleteTagFunction,
  EmptyTagFunction,
  GetTagEntriesFunction,
  GetTagEntryFunction,
  RemoveJournalEntryFromTagFunction,
  UpdateTagFunction,
} from "@/types/tag";

/******** ADD or GET **********************/

export const addOrGetTags: AddOrGetTagsFunction = async (
  dataToAddOrGetTags
) => {
  try {
    const existingTags = await prismaClient.tag.findMany({
      where: {
        OR: dataToAddOrGetTags.map((tag) => ({
          name: tag.name,
        })),
      },
    });

    if (existingTags.length === dataToAddOrGetTags.length) {
      return {
        errorMessage: null,
        payload: existingTags.map((tag) => ({
          ...tag,
          journalEntries: [],
        })),
      };
    }

    const newTags = dataToAddOrGetTags.filter(
      (tag) => !existingTags.map((t) => t.name).includes(tag.name)
    );

    const { count } = await prismaClient.tag.createMany({
      data: newTags,
      skipDuplicates: true,
    });

    if (count !== newTags.length) {
      throw new Error("Not all tags were created.");
    }

    const createdTags = await prismaClient.tag.findMany({
      where: {
        OR: newTags.map((tag) => ({
          name: tag.name,
        })),
      },
    });

    return {
      errorMessage: null,
      payload: [...existingTags, ...createdTags].map((tag) => ({
        ...tag,
        journalEntries: [],
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
          orderBy: {
            createdAt:
              options?.sort?.by === "date" ? options.sort.order : "asc",
            title: options?.sort?.by === "title" ? options.sort.order : "asc",
          },
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

export const getTags: GetTagEntriesFunction = async ({ options }) => {
  try {
    const initFindManyOptions = {
      take: options?.limit,
      skip: options?.offset,
      where: {
        AND: [
          options?.filters?.date
            ? {
                createdAt: {
                  equals: options.filters.date,
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

const removeJournalEntryFromTag: RemoveJournalEntryFromTagFunction = async ({
  name,
  journalEntry,
}) => {
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

const deleteTag: DeleteTagFunction = async ({ name }) => {
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
