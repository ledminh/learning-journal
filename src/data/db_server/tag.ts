import { JournalEntry } from "@/types/journal_entry";
import prismaClient from "./prismaClient";

import { AddOrGetTagsFunction } from "@/types/tag";

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
