import * as dbServer from "@/data/db_server";
import {
  GetTagsFunction,
  GetTagFunction,
  AddTagsFunction,
  UpdateTagFunction,
  EmptyTagFunction,
  DeleteTagFunction,
} from "./types";
import { convertJournalEntryFromDBServer } from "../server/journal_entry";
import { Tag } from "../server/types/tag";
import {
  MaterialType,
  materialTypeMapToDBServer,
} from "../server/types/material";
import { JournalEntry } from "../server/types/journal_entry";
import createSlug from "@/utils/createSlug";
import { TagEntry } from "../db_server/types";

export const getTags: GetTagsFunction = async function ({ limit }) {
  const { errorMessage, payload } = await dbServer.Tag.getTags({
    options: {
      limit: limit,
      sort: {
        by: "name",
        order: "asc",
      },
    },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: payload?.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      journalEntries: tag.journalEntries.map(convertJournalEntryFromDBServer),
    })) as Tag[],
  };
};

export const getTag: GetTagFunction = async function (params) {
  const filters = params.filters
    ? {
        materialType:
          materialTypeMapToDBServer[
            params.filters.materialType as MaterialType
          ],
        keyword: params.filters.keyword,
      }
    : undefined;

  const { errorMessage, payload } = await dbServer.Tag.getTag({
    name: params.name,
    options: {
      limit: params.limit,
      offset: params.offset,
      sort: {
        by: params.sort?.by,
        order: params.sort?.order,
      },
      filters,
    },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      id: payload?.id as string,
      name: payload?.name as string,
      slug: payload?.slug as string,

      journalEntries: payload?.journalEntries.map(
        convertJournalEntryFromDBServer
      ) as JournalEntry[],
    },
  };
};

export const addTags: AddTagsFunction = async function ({ names }) {
  const { errorMessage, payload } = await dbServer.Tag.addTags(
    names.map((name) => ({
      name,
      slug: createSlug(name),
    }))
  );

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: payload?.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      journalEntries: tag.journalEntries.map(convertJournalEntryFromDBServer),
    })) as Tag[],
  };
};

export const updateTag: UpdateTagFunction = async function ({ name, newName }) {
  const { errorMessage, payload } = await dbServer.Tag.getTag({
    name,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  const { errorMessage: errorMessage2, payload: payload2 } =
    await dbServer.Tag.updateTag(payload as TagEntry);

  if (errorMessage2) {
    return {
      errorMessage: errorMessage2,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      ...payload2,
      journalEntries: payload2?.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    } as Tag,
  };
};
export const emptyTag: EmptyTagFunction = async function ({ name }) {
  const { errorMessage, payload } = await dbServer.Tag.emptyTag({
    name,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      ...payload,
      journalEntries: payload?.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    } as Tag,
  };
};

export const deleteTag: DeleteTagFunction = async function ({ name }) {
  const { errorMessage, payload } = await dbServer.Tag.deleteTag({
    name,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      ...payload,
      journalEntries: payload?.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    } as Tag,
  };
};
