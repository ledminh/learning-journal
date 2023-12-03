import {
  UploadImageFunction,
  GenerateJournalEntryDescriptionFunction,
  GetJournalEntryFunction,
  UploadImageAPIResponse,
  GenerateJournalEntryDescriptionAPIResponse,
  DataToGenerateJournalEntryDescription,
} from "@/types/journal_entry";
import { post } from "./utils";

/************************************************
 * API functions
 ************************************************/

export const uploadImage: UploadImageFunction = async function (params) {
  const payload = await post<UploadImageAPIResponse>({
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

/******** READ **********************/

export const getJournalEntry: GetJournalEntryFunction = async function (
  params
) {
  const response = await fetch(`/api/journal-entries/${params.slug}`);

  if (!response.ok) {
    return {
      errorMessage: "Failed to get journal entry",
      payload: null,
    };
  }

  const json = await response.json();

  return {
    errorMessage: null,
    payload: json,
  };
};

/******** UPDATE **********************/
/******** DELETE **********************/
