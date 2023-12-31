import { MaterialType } from "@/data/server/types/material";
export type MaterialOption = "quote" | "code" | "image" | "link";

export const mapFilterToMaterial: Record<MaterialOption, MaterialType> = {
  quote: MaterialType.QUOTE,
  code: MaterialType.CODE,
  image: MaterialType.IMAGE,
  link: MaterialType.LINK,
};
