import {
  JournalEntry,
  UploadImageFunction,
  GenerateJournalEntryDescriptionFunction,
  GetJournalEntryFunction,
  GetJournalEntriesFunction,
  ImageAPIResponse,
  GenerateJournalEntryDescriptionAPIResponse,
  DataToGenerateJournalEntryDescription,
  CreateJournalEntryFunction,
  UpdateJournalEntryFunction,
  DeleteJournalEntryFunction,
  DeleteImageFunction,
  DataToCreateJournalEntry,
} from "@/types/journal_entry";

import { post, get } from "./utils";
import generateID from "@/utils/generateID";
import createSlug from "@/utils/createSlug";

/************************************************
 * Preparing functions
 ************************************************/

export const uploadImage: UploadImageFunction = async function (params) {
  const payload = await post<ImageAPIResponse>({
    url: "/api/upload-image",
    type: "file",
    payload: {
      file: params.image,
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to upload image",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

export const deleteImage: DeleteImageFunction = async function (params) {
  const payload = await post<ImageAPIResponse>({
    url: "/api/delete-image",
    type: "json",
    payload: {
      json: {
        url: params.url,
      },
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to delete image",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

export const generateJournalEntryDescription: GenerateJournalEntryDescriptionFunction =
  async function (params) {
    const payload = await post<
      GenerateJournalEntryDescriptionAPIResponse,
      DataToGenerateJournalEntryDescription
    >({
      url: "/api/generate-journal-entry-description",
      type: "json",
      payload: {
        json: {
          title: params.title,
          content: params.content,
          material: params.material,
        },
      },
    });

    if (!payload) {
      return {
        errorMessage: "Failed to generate journal entry description",
        payload: null,
      };
    }

    return {
      errorMessage: null,
      payload,
    };
  };

/************************************************
 * CLIENT functions: CRUD
 ************************************************/

/******** CREATE **********************/
export const createJournalEntry: CreateJournalEntryFunction = async function (
  params
) {
  const payload = await post<JournalEntry, DataToCreateJournalEntry>({
    url: `/api/create-journal-entry`,
    type: "json",
    payload: {
      json: params,
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to create journal entry",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

/******** READ **********************/

export const getJournalEntry: GetJournalEntryFunction = async function (
  params
) {
  const payload = await get<JournalEntry>({
    url: `/api/journal-entries`,
    queryParams: {
      slug: params.slug,
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to get journal entry",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

export const getJournalEntries: GetJournalEntriesFunction = async function (
  params
) {
  const payload = await get<JournalEntry[]>({
    url: `/api/journal-entries`,
    queryParams: JSON.parse(JSON.stringify(params)),
  });

  if (!payload) {
    return {
      errorMessage: "Failed to get journal entries",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

/******** UPDATE **********************/
export const updateJournalEntry: UpdateJournalEntryFunction = async function (
  params
) {
  const payload = await post<JournalEntry, JournalEntry>({
    url: `/api/update-journal-entry`,
    type: "json",
    payload: {
      json: params,
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to update journal entry",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};

/******** DELETE **********************/

export const deleteJournalEntry: DeleteJournalEntryFunction = async function (
  params
) {
  const payload = await post<JournalEntry, { id: string }>({
    url: `/api/delete-journal-entry`,
    type: "json",
    payload: {
      json: {
        id: params.id,
      },
    },
  });

  if (!payload) {
    return {
      errorMessage: "Failed to delete journal entry",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload,
  };
};
