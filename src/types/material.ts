import { AsyncFunction } from "./";

export enum MaterialType {
  Link = "MaterialType/link",
  Quote = "MaterialType/quote",
  Code = "MaterialType/code",
  Image = "MaterialType/image",
}

export type Material = {
  id: string;
  type: MaterialType;
  content: string;
};

/************************************************
 * CRUD
 ************************************************/

/******** CREATE **********************/

export type DataToCreateMaterial = Omit<
  | {
      type: MaterialType.Link | MaterialType.Quote | MaterialType.Code;
      content: string;
    }
  | {
      type: MaterialType.Image;
      content: File;
    },
  "id"
>;

export type DataToAddMaterial = Omit<Material, "id">;

export type CreateMaterialFunction = AsyncFunction<
  DataToCreateMaterial,
  DataToAddMaterial
>;

export type AddMaterialFunction = AsyncFunction<DataToAddMaterial, Material>;

/******** READ **********************/
// Material is always read together with journal entry.

/******** UPDATE **********************/

export type UpdateMaterialFunction = AsyncFunction<Material, Material>;

/******** DELETE **********************/
export type DeleteMaterialFunction = AsyncFunction<
  {
    id: string;
  },
  Material
>;