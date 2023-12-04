import {
  UploadImageFunction,
  GenerateJournalEntryDescriptionFunction,
  GetJournalEntryFunction,
  GetJournalEntriesFunction,
  CreateJournalEntryFunction,
  UpdateJournalEntryFunction,
  DeleteJournalEntryFunction,
  DeleteImageFunction,
} from "@/types/journal_entry";

/************************************************
 * Preparing functions
 ************************************************/

export const uploadImage: UploadImageFunction = async function (params) {
  const image = params.image;

  // Do something with the image

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

export const deleteImage: DeleteImageFunction = async function (params) {
  const url = params.url;

  // Do something with the image's url

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

export const generateJournalEntryDescription: GenerateJournalEntryDescriptionFunction =
  async function (params) {
    const title = params.title;
    const content = params.content;
    const material = params.material;

    // Do something with the title, content, and material

    return {
      errorMessage: "Not yet implemented",
      payload: null,
    };
  };

/************************************************
 * CLIENT functions: CRUD
 ************************************************/

/******** CREATE **********************/
export const createJournalEntry: CreateJournalEntryFunction = async function (
  params
) {
  const dataToCreateJournalEntry = params;

  // Do something with the dataToCreateJournalEntry (it doesn't have id, slug, createdAt, and updatedAt)

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

/******** READ **********************/

export const getJournalEntry: GetJournalEntryFunction = async function (
  params
) {
  const slug = params.slug;

  // Do something with the slug

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

export const getJournalEntries: GetJournalEntriesFunction = async function (
  params
) {
  // Do something with the params

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

/******** UPDATE **********************/
export const updateJournalEntry: UpdateJournalEntryFunction = async function (
  params
) {
  const updatedJournalEntry = params;

  // Do something with the updatedJournalEntry

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};

/******** DELETE **********************/

export const deleteJournalEntry: DeleteJournalEntryFunction = async function (
  params
) {
  const id = params.id;

  // Do something with the id

  return {
    errorMessage: "Not yet implemented",
    payload: null,
  };
};
