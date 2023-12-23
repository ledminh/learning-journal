import { JournalEntry } from "../server/types/journal_entry";
import { convertJournalEntryFromDBServer } from "../server/journal_entry";
import { materialTypeMapToDBServer } from "../server/types/material";
import {
  AddJournalEntryFunction,
  GetJournalEntriesFunction,
  GetJournalEntryFunction,
  UpdateJournalEntryFunction,
  DeleteJournalEntryFunction,
} from "./types";
import * as dbJournalEntry from "@/data/db_server/journal_entry";
import createSlug from "@/utils/createSlug";
import { addTags } from "./tag";
import { createMaterial } from "../server/material";
import { DataToAddMaterial, Material } from "@/data/db_server/types";
import { createAndAddDate, getDate } from "../db_server/date";

import { getMaterial } from "../db_server/material";

import { MaterialType } from "../server/types/material";
import { deleteImage } from "../server/material";

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

export const addJournalEntry: AddJournalEntryFunction = async (data) => {
  // Prepare tags
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

  // Prepare material
  const { errorMessage: errorMessage2, payload: material } =
    await createMaterial(data.material);

  if (errorMessage2) {
    return {
      errorMessage: errorMessage2,
      payload: null,
    };
  }

  // Prepare date
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

export const updateJournalEntry: UpdateJournalEntryFunction = async function (
  data
) {
  const { errorMessage: errorMessageOJE, payload: oldJournalEntry } =
    await dbJournalEntry.getJournalEntry({ slug: data.slug });

  if (errorMessageOJE) {
    return {
      errorMessage: errorMessageOJE,
      payload: null,
    };
  }

  // Prepare material

  let material: Material | null = null;

  if (data.material.id !== null) {
    const { errorMessage: errorMessageOMT, payload: oldMaterial } =
      await getMaterial({ id: data.material.id });

    if (errorMessageOMT) {
      return {
        errorMessage: errorMessageOMT,
        payload: null,
      };
    }
    material = oldMaterial as Material;
  } else {
    const { errorMessage: errorMessageCM, payload: newMaterial } =
      await createMaterial(data.material);

    if (errorMessageCM) {
      return {
        errorMessage: errorMessageCM,
        payload: null,
      };
    }

    material = {
      ...(newMaterial as DataToAddMaterial),
      id: oldJournalEntry!.material.id,
      createdAt: oldJournalEntry!.material.createdAt,
    };

    if (
      oldJournalEntry!.material.type ===
      materialTypeMapToDBServer[MaterialType.IMAGE]
    ) {
      const { errorMessage: errorMessageDI } = await deleteImage({
        imageUrl: oldJournalEntry!.material.content,
      });

      if (errorMessageDI) {
        return {
          errorMessage: errorMessageDI,
          payload: null,
        };
      }
    }
  }

  // Prepare tags
  const names = (
    data.tags.filter((tag) => tag.name !== null) as {
      name: string;
      id: null;
    }[]
  ).map((tag) => tag.name);

  const { errorMessage: errorMessageAT, payload: newTags } = await addTags({
    names,
  });

  if (errorMessageAT) {
    return {
      errorMessage: errorMessageAT,
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

  // Prepare material

  const { errorMessage: errorMessageJE, payload } =
    await dbJournalEntry.updateJournalEntry({
      id: data.id,
      title: data.title,
      slug: createSlug(data.title),
      description: data.description,
      content: data.content,
      material: material,
      tagIDs,
    });

  if (errorMessageJE) {
    return {
      errorMessage: errorMessageJE,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: convertJournalEntryFromDBServer(payload!),
  };
};

export const deleteJournalEntry: DeleteJournalEntryFunction = async function (
  data
) {
  const { errorMessage } = await dbJournalEntry.deleteJournalEntry({
    id: data.id,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  if (data.material.type === MaterialType.IMAGE) {
    const { errorMessage: errorMessageDI } = await deleteImage({
      imageUrl: data.material.content,
    });

    if (errorMessageDI) {
      return {
        errorMessage: errorMessageDI,
        payload: null,
      };
    }
  }

  return {
    errorMessage: null,
    payload: {
      success: true,
    },
  };
};
