import {
  CreateMaterialFunction,
  GenerateMaterialLinkContentFunction,
  UploadImageFunction,
  DeleteImageFunction,
} from "./types/material";

/***************************
 * Function(s)
 */

export const createMaterial: CreateMaterialFunction = async (data) => {
  return {
    errorMessage: "Not implemented",
    payload: null,
  };
};

export const generateMaterialLinkContent: GenerateMaterialLinkContentFunction =
  async (data) => {
    return {
      errorMessage: "Not implemented",
      payload: null,
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
