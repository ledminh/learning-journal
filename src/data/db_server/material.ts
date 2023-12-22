import prismaClient from "./prismaClient";

import {
  CreateMaterialFunction,
  GetMaterialFunction,
  UpdateMaterialFunction,
  DeleteMaterialFunction,
  materialTypeMapFromDB,
  materialTypeMapToDB,
} from "@/data/db_server/types/material";

/************************************************
 * CRUD
 ************************************************/

/******** CREATE ******************/

export const createMaterial: CreateMaterialFunction = async function ({
  type,
  content,
}) {
  try {
    const dbMaterial = await prismaClient.material.create({
      data: {
        type: materialTypeMapToDB[type],
        content,
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...dbMaterial,
        type: materialTypeMapFromDB[dbMaterial.type],
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error)
      return {
        errorMessage: error.message,
        payload: null,
      };
    else
      return {
        errorMessage: "Unknown error",
        payload: null,
      };
  }
};

/******** READ ******************/
export const getMaterial: GetMaterialFunction = async function ({ id }) {
  try {
    const dbMaterial = await prismaClient.material.findUnique({
      where: {
        id,
      },
    });

    if (!dbMaterial)
      return {
        errorMessage: "Material not found",
        payload: null,
      };

    return {
      errorMessage: null,
      payload: {
        ...dbMaterial,
        type: materialTypeMapFromDB[dbMaterial.type],
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

/******** UPDATE **********************/

export const updateMaterial: UpdateMaterialFunction = async function (
  material
) {
  try {
    const dbMaterial = await prismaClient.material.update({
      where: {
        id: material.id,
      },
      data: {
        ...material,
        type: materialTypeMapToDB[material.type],
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...dbMaterial,
        type: materialTypeMapFromDB[dbMaterial.type],
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};

/******** DELETE **********************/

export const deleteMaterial: DeleteMaterialFunction = async function ({ id }) {
  try {
    const dbMaterial = await prismaClient.material.delete({
      where: {
        id,
      },
    });

    return {
      errorMessage: null,
      payload: {
        ...dbMaterial,
        type: materialTypeMapFromDB[dbMaterial.type],
      },
    };
  } catch (error: any) {
    return {
      errorMessage: error.message,
      payload: null,
    };
  }
};
