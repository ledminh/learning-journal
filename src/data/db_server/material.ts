import prismaClient from "./prismaClient";

import { MaterialType as DBMaterialType } from "@prisma/client";
import {
  MaterialType,
  AddMaterialFunction,
  UpdateMaterialFunction,
  DeleteMaterialFunction,
} from "@/types/material";

// Mapping

const materialTypeMapToDB = {
  [MaterialType.Link]: DBMaterialType.LINK,
  [MaterialType.Quote]: DBMaterialType.QUOTE,
  [MaterialType.Code]: DBMaterialType.CODE,
  [MaterialType.Image]: DBMaterialType.IMAGE,
};

const materialTypeMapFromDB = {
  [DBMaterialType.LINK]: MaterialType.Link,
  [DBMaterialType.QUOTE]: MaterialType.Quote,
  [DBMaterialType.CODE]: MaterialType.Code,
  [DBMaterialType.IMAGE]: MaterialType.Image,
};

// Functions

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
