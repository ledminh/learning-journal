import {
  CreateJournalEntryFunction,
  ConvertJournalEntryFromDBServerFunction,
} from "./types/journal_entry";

export const createJournalEntry: CreateJournalEntryFunction = async ({
  title,
  tags,
  description,
  material,
  content,
}) => {
  return {
    errorMessage: "Not implemented",
    payload: null,
  };
};

/******** HELPERS **********************/

export const convertJournalEntryFromDBServerFunction: ConvertJournalEntryFromDBServerFunction =
  async ({
    id,
    title,
    slug,
    createdAt,
    updatedAt,
    material,
    description,
    content,
  }) => {
    return {
      errorMessage: "Not implemented",
      payload: null,
    };
  };
