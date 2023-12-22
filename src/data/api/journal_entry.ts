import { JournalEntry } from "../server/types/journal_entry";
import { convertJournalEntryFromDBServer } from "../server/journal_entry";
import { materialTypeMapToDBServer } from "../server/types/material";
import {
  AddJournalEntryFunction,
  GetJournalEntriesFunction,
  GetJournalEntryFunction,
} from "./types";
import * as dbJournalEntry from "@/data/db_server/journal_entry";
import createSlug from "@/utils/createSlug";
import { addTags } from "./tag";
import { createMaterial } from "../server/material";
import { DataToAddMaterial } from "@/data/db_server/types";
import { createAndAddDate, getDate } from "../db_server/date";

export const getJournalEntries: GetJournalEntriesFunction = async ({
  limit,
  offset,
  filters,
  sort,
}) => {
  const _filters = filters
    ? {
        materialType: filters.materialType
          ? materialTypeMapToDBServer[filters.materialType]
          : undefined,
        keyword: filters.keyword,
      }
    : undefined;

  const { errorMessage, payload } = await dbJournalEntry.getJournalEntries({
    limit,
    offset,
    filters: _filters,
    sort,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: payload?.map(convertJournalEntryFromDBServer) as JournalEntry[],
  };
};

export const getJournalEntry: GetJournalEntryFunction = async ({ slug }) => {
  const { errorMessage, payload } = await dbJournalEntry.getJournalEntry({
    slug,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: convertJournalEntryFromDBServer(payload!),
  };
};

export const addJournalEntry: AddJournalEntryFunction = async (data) => {
  const names = (
    data.tags.filter((tag) => tag.name !== null) as {
      name: string;
      id: null;
    }[]
  ).map((tag) => tag.name);

  const { errorMessage: errorMessage1, payload: newTags } = await addTags({
    names,
  });

  if (errorMessage1) {
    return {
      errorMessage: errorMessage1,
      payload: null,
    };
  }

  const tagIDs = data.tags.map((tag) => {
    if (tag.name) {
      return newTags!.find((newTag) => newTag.name === tag.name)!.id;
    } else {
      return tag.id as string;
    }
  });

  const { errorMessage: errorMessage2, payload: material } =
    await createMaterial(data.material);

  if (errorMessage2) {
    return {
      errorMessage: errorMessage2,
      payload: null,
    };
  }

  const { errorMessage: errorMessage3, payload: date } = await getDate({
    date: new Date(),
  });

  let dbDate = date;

  if (errorMessage3 !== null && date === null) {
    return {
      errorMessage: errorMessage3,
      payload: null,
    };
  } else if (errorMessage3 === null && date === null) {
    const { errorMessage: errorMessage4, payload: newDate } =
      await createAndAddDate({
        date: new Date(),
      });

    if (errorMessage4) {
      return {
        errorMessage: errorMessage4,
        payload: null,
      };
    }

    dbDate = newDate;
  }

  const { errorMessage, payload } = await dbJournalEntry.addJournalEntry({
    title: data.title,
    slug: createSlug(data.title),
    description: data.description,
    tagIDs,
    material: material as DataToAddMaterial,
    content: data.content,
    date: { id: dbDate!.id },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: convertJournalEntryFromDBServer(payload!),
  };
};

function updateJournalEntry() {}
function deleteJournalEntry() {}
