import post from "./post";
import { GenerateJournalEntryDescriptionFunction } from "../server/types/helpers";

export const generateJEDescription: GenerateJournalEntryDescriptionFunction =
  async ({ title, content, material }) =>
    await post({
      url: "api/generate_je_description",
      body: {
        title,
        content,
        material,
      },
    });
