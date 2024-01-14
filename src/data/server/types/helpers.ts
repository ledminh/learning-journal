import { AsyncFunction } from "@/types";
import { DataToCreateMaterial, Material } from "./material";

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  {
    title: string;
    content: string;
    material: DataToCreateMaterial | Material;
  },
  {
    description: string;
  }
>;
