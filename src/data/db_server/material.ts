import prismaClient from "./prismaClient";

import {
  UpdateMaterialFunction,
  DeleteMaterialFunction,
  materialTypeMapFromDB,
  materialTypeMapToDB,
} from "@/data/db_server/types/material";

// Functions

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
