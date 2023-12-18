import axios from "axios";
import { load } from "cheerio";

import { createClient } from "@supabase/supabase-js";
import { FileOptions } from "@supabase/storage-js";

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
    case MaterialType.LINK: {
      const { url, title, description, imageUrl } = content;

      return {
        errorMessage: null,
        payload: {
          type: materialTypeMapToDBServer[MaterialType.LINK],
          content: JSON.stringify({ url, title, description, imageUrl }),
        },
      };
    }

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

export const uploadImage: UploadImageFunction = async ({ imageFile }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_API_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  const fileName = imageFile.name.split(".")[0] + "_" + Date.now();
  const fileType = imageFile.name.split(".")[1];

  const filePath = `${fileName}.${fileType === "jpeg" ? "jpg" : fileType}`;

  const fileOptions: FileOptions = {
    contentType: imageFile.type || "image/jpeg",
    cacheControl: "3600",
    upsert: true,
  };

  const { data, error } = await supabase.storage
    .from("images")
    .upload(filePath, imageFile, fileOptions);

  if (error) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      imageUrl:
        process.env.SUPABASE_URL +
        "/storage/v1/object/public/images/" +
        data.path,
    },
  };
};

export const deleteImage: DeleteImageFunction = async (data) => {
  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_API_KEY as string,
    {
      auth: { persistSession: false },
    }
  );

  const { imageUrl } = data;

  const fileName = imageUrl.split("/").pop();

  if (!fileName) {
    return {
      errorMessage: "Unable to delete image. Invalid image url.",
      payload: null,
    };
  }

  const nameArr = fileName.split(".");

  const type = nameArr[1];
  const name = nameArr[0];
  const filePaths = [`${name}.${type === "jpeg" ? "jpg" : type}`];

  const { error } = await supabase.storage.from("images").remove(filePaths);

  if (error) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      success: true,
    },
  };
};
