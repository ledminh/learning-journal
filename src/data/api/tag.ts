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
    slug: params.slug,
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

  if (!payload) {
    return {
      errorMessage: "No payload",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      tag: {
        ...payload.tag,
        journalEntries: payload.tag.journalEntries.map(
          convertJournalEntryFromDBServer
        ),
      },
      numJournalEntries: payload.numJournalEntries,
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
    slug: createSlug(name),
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  if (!payload) {
    return {
      errorMessage: "tag not found",
      payload: null,
    };
  }

  const { errorMessage: errorMessage2, payload: payload2 } =
    await dbServer.Tag.updateTag({
      ...payload.tag,
      name: newName,
      slug: createSlug(newName),
    });

  if (errorMessage2) {
    return {
      errorMessage: errorMessage2,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      id: payload2!.id,
      name: payload2!.name,
      slug: payload2!.slug,
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
      id: payload!.id,
      name: payload!.name,
      slug: payload!.slug,
      journalEntries: payload!.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    },
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
      id: payload!.id,
      name: payload!.name,
      slug: payload!.slug,
      journalEntries: [],
    },
  };
};
