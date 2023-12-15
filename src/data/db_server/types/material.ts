import { MaterialType as DBMaterialType } from "@prisma/client";

import { AsyncFunction } from "@/data/types";

export enum MaterialType {
  Link = "MaterialType/link",
  Quote = "MaterialType/quote",
  Code = "MaterialType/code",
  Image = "MaterialType/image",
}

export const materialTypeMapToDB = {
  [MaterialType.Link]: DBMaterialType.LINK,
  [MaterialType.Quote]: DBMaterialType.QUOTE,
  [MaterialType.Code]: DBMaterialType.CODE,
  [MaterialType.Image]: DBMaterialType.IMAGE,
};

export const materialTypeMapFromDB = {
  [DBMaterialType.LINK]: MaterialType.Link,
  [DBMaterialType.QUOTE]: MaterialType.Quote,
  [DBMaterialType.CODE]: MaterialType.Code,
  [DBMaterialType.IMAGE]: MaterialType.Image,
};

export type Material = {
  id: string;
  type: MaterialType;
  content: string;
  createdAt: Date;
};

export type DataToAddMaterial = Omit<Material, "id" | "createdAt">;

/************************************************
 * CRUD
 ************************************************/

/******** UPDATE **********************/

export type UpdateMaterialFunction = AsyncFunction<Material, Material>;

/******** DELETE **********************/
export type DeleteMaterialFunction = AsyncFunction<
  {
    id: string;
  },
  Material
>;
