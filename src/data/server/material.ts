import axios from "axios";
import { load } from "cheerio";

import {
  CreateMaterialFunction,
  GenerateDataForMaterialLinkContentFunction,
  UploadImageFunction,
  DeleteImageFunction,
  MaterialType,
  materialTypeMapToDBServer,
} from "./types/material";

/***************************
 * Function(s)
 */

export const createMaterial: CreateMaterialFunction = async (data) => {
  const { type, content } = data;

  switch (type) {
    case MaterialType.LINK:
      const { url, title, description, imageUrl } = content;

      return {
        errorMessage: null,
        payload: {
          type: materialTypeMapToDBServer[MaterialType.LINK],
          content: JSON.stringify({ url, title, description, imageUrl }),
        },
      };

    case MaterialType.QUOTE:
    case MaterialType.CODE:
      return {
        errorMessage: null,
        payload: {
          type: materialTypeMapToDBServer[type],
          content,
        },
      };

    case MaterialType.IMAGE:
      const image = content;

      const { errorMessage, payload } = await uploadImage({
        imageFile: image,
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
          type: materialTypeMapToDBServer[type],
          content: payload?.imageUrl as string,
        },
      };
    default:
      return {
        errorMessage: "Unknown material type",
        payload: null,
      };
  }
};

export const generateDataForMaterialLinkContent: GenerateDataForMaterialLinkContentFunction =
  async (data) => {
    const { url } = data;

    const response = await axios.get(url);

    const $ = load(response.data);
    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");
    const imageUrls = $("img")
      .map((i, el) => $(el).attr("src"))
      .get();

    if (!title || !description || !imageUrls.length) {
      return {
        errorMessage: "Unable to generate link content",
        payload: null,
      };
    }

    return {
      errorMessage: null,
      payload: {
        url,
        title,
        description,
        imageUrls,
      },
    };
  };

export const uploadImage: UploadImageFunction = async (data) => {
  return {
    errorMessage: "Not implemented",
    payload: null,
  };
};

export const deleteImage: DeleteImageFunction = async (data) => {
  return {
    errorMessage: "Not implemented",
    payload: null,
  };
};
