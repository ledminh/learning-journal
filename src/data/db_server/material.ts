import prismaClient from "./prismaClient";

import {
  AddMaterialFunction,
  UpdateMaterialFunction,
  DeleteMaterialFunction,
} from "@/types/material";

// Mapping
import { materialTypeMapFromDB, materialTypeMapToDB } from "@/types/material";

// Functions

/******** ADD **********************/

export const addMaterial: AddMaterialFunction = async function (dataToAddMT) {
  const dbType = materialTypeMapToDB[dataToAddMT.type];

  try {
    const dbMaterial = await prismaClient.material.create({
      data: {
        ...dataToAddMT,
        type: dbType,
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

/******** UPDATE **********************/

export const updateMaterial: UpdateMaterialFunction = async function (
  material
) {
  const dbType = materialTypeMapToDB[material.type];

  try {
    const dbMaterial = await prismaClient.material.update({
      where: {
        id: material.id,
      },
      data: {
        ...material,
        type: dbType,
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
