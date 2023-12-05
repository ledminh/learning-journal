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

export type CreateMaterialFunction = AsyncFunction<
  DataToCreateMaterial,
  Material
>;

/******** READ **********************/
// Material is always read together with journal entry.

/******** UPDATE **********************/
export type UpdateMaterialFunction = AsyncFunction<
  DataToCreateMaterial,
  Material
>;

/******** DELETE **********************/
export type DeleteMaterialFunction = AsyncFunction<
  {
    id: string;
  },
  Material
>;
