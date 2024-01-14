import { AsyncFunction } from "@/types";
import * as dbServerType from "@/data/db_server/types";

/***************************
 * Data
 */

export enum MaterialType {
  LINK = "MATERIAL_LINK",
  QUOTE = "MATERIAL_QUOTE",
  IMAGE = "MATERIAL_IMAGE",
  CODE = "MATERIAL_CODE",
}

export type MaterialLinkContent = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type Material = {
  id: string;
} & (
  | {
      type: MaterialType.LINK;
      content: MaterialLinkContent;
    }
  | {
      type: MaterialType.QUOTE | MaterialType.CODE | MaterialType.IMAGE;
      content: string;
    }
);

export type DataToCreateMaterial =
  | {
      type: MaterialType.QUOTE | MaterialType.CODE;
      content: string;
    }
  | {
      type: MaterialType.IMAGE;
      content: File;
    }
  | {
      type: MaterialType.LINK;
      content: MaterialLinkContent;
    };

export const materialTypeMapToDBServer = {
  [MaterialType.LINK]: dbServerType.MaterialType.Link,
  [MaterialType.QUOTE]: dbServerType.MaterialType.Quote,
  [MaterialType.CODE]: dbServerType.MaterialType.Code,
  [MaterialType.IMAGE]: dbServerType.MaterialType.Image,
};

export const materialTypeMapFromDBServer = {
  [dbServerType.MaterialType.Link]: MaterialType.LINK,
  [dbServerType.MaterialType.Quote]: MaterialType.QUOTE,
  [dbServerType.MaterialType.Code]: MaterialType.CODE,
  [dbServerType.MaterialType.Image]: MaterialType.IMAGE,
};

/***************************
 * Function(s)
 */

export type CreateMaterialFunction = AsyncFunction<
  DataToCreateMaterial,
  dbServerType.DataToAddMaterial
>;

export type GenerateDataForMaterialLinkContentFunction = AsyncFunction<
  { url: string },
  Omit<MaterialLinkContent, "imageUrl"> & { imageUrls: string[] }
>;

export type UploadImageFunction = AsyncFunction<
  { imageFile: File },
  { imageUrl: string }
>;

export type DeleteImageFunction = AsyncFunction<
  { imageUrl: string },
  {
    success: boolean;
  }
>;
