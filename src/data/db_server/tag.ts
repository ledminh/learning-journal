import {
  materialTypeMapToDB,
  materialTypeMapFromDB,
} from "@/data/db_server/types/material";
import prismaClient from "./prismaClient";

import {
  AddTagsFunction,
  DeleteTagFunction,
  EmptyTagFunction,
  GetTagEntriesFunction,
  GetTagEntryFunction,
  RemoveJournalEntryFromTagFunction,
  UpdateTagFunction,
} from "@/data/db_server/types/tag";
import { getStartOfDate } from "@/utils/dateFunctions";

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

export const getTag: GetTagEntryFunction = async ({ slug, options }) => {
  try {
    const tag = await prismaClient.tag.findUnique({
      where: {
        slug,
      },
      include: {
        journalEntries: {
          where: {
            AND: [
              options?.filters?.date
                ? {
                    date: {
                      date: getStartOfDate(options.filters.date),
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
          orderBy: !options?.sort
            ? [
                {
                  title: "asc",
                },
                {
                  createdAt: "asc",
                },
              ]
            : options.sort.by === "title"
            ? [
                {
                  title: options.sort.order,
                },
                {
                  createdAt: "asc",
                },
              ]
            : [
                {
                  createdAt: options.sort.order,
                },
                {
                  title: "asc",
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
          id: journalEntry.id,
          title: journalEntry.title,
          slug: journalEntry.slug,
          content: journalEntry.content,
          description: journalEntry.description,
          createdAt: journalEntry.createdAt,
          updatedAt: journalEntry.updatedAt,
          material: {
            id: journalEntry.material.id,
            content: journalEntry.material.content,
            type: materialTypeMapFromDB[journalEntry.material.type],
            createdAt: journalEntry.material.createdAt,
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
        AND: [
          names?.length ? { name: { in: names } } : {},
          options?.filters?.keyword
            ? {
                name: {
                  contains: options.filters.keyword,
                },
              }
            : {},
        ],
      },
      ...(options?.sort && {
        orderBy: {
          name: options.sort.order ?? "asc",
        },
      }),
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
            tags: {
              orderBy: {
                name: "asc",
              },
            },
          },
          orderBy: [
            {
              title: "asc",
            },
            {
              createdAt: "asc",
            },
          ],
        },
      },
    });

    return {
      errorMessage: null,
      payload: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        journalEntries: tag.journalEntries.map((journalEntry) => ({
          id: journalEntry.id,
          title: journalEntry.title,
          slug: journalEntry.slug,
          content: journalEntry.content,
          description: journalEntry.description,
          createdAt: journalEntry.createdAt,
          updatedAt: journalEntry.updatedAt,
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
  async ({ name, journalEntryID }) => {
    try {
      const tag = await prismaClient.tag.update({
        where: {
          name,
        },
        data: {
          journalEntries: {
            disconnect: {
              id: journalEntryID,
            },
          },
        },
        include: {
          journalEntries: {
            include: {
              material: true,
              tags: {
                orderBy: {
                  name: "asc",
                },
              },
            },
          },
        },
      });

      return {
        errorMessage: null,
        payload: {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          createdAt: tag.createdAt,
          journalEntries: tag.journalEntries.map((journalEntry) => ({
            id: journalEntry.id,
            title: journalEntry.title,
            slug: journalEntry.slug,
            content: journalEntry.content,
            description: journalEntry.description,
            createdAt: journalEntry.createdAt,
            updatedAt: journalEntry.updatedAt,
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
