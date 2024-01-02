import { GenerateJournalEntryDescriptionFunction } from "./types/helpers";

import { askGPT } from "./openai";
import { MaterialType } from "./types/material";

export const generateJournalEntryDescription: GenerateJournalEntryDescriptionFunction =
  async ({ title, content, material }) => {
    try {
      const { type: materialType } = material;

      let materialContent = "";

      if (materialType === MaterialType.QUOTE) {
        materialContent =
          "This material is a quote. The quote is: " + material.content;
      } else if (materialType === MaterialType.CODE) {
        materialContent =
          "This material is a code. The code is: " + material.content;
      } else if (materialType === MaterialType.IMAGE) {
        materialContent =
          "This material is an image with url: " + material.content;
      } else if (materialType === MaterialType.LINK) {
        materialContent =
          "This material is a link to a page that has title: " +
          material.content.title +
          " and description: " +
          material.content.description +
          " and url: " +
          material.content.url;
      }

      const question = `A journal entry has 3 section: title, content, and material. Summarize the following journal entry into one sentence.
      Title: ${title}
      Content: ${content}
      Material: ${materialContent}`;

      const description = await askGPT(question);

      if (!description) {
        throw new Error("Failed to generate a description");
      }

      return {
        errorMessage: null,
        payload: { description },
      };
    } catch (error: any) {
      return {
        errorMessage: error.message,
        payload: null,
      };
    }
  };
