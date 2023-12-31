import { AsyncFunction } from "@/data/types";
import { DataToCreateMaterial, Material } from "./material";

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  {
    title: string;
    content: string;
    material: DataToCreateMaterial;
  },
  {
    description: string;
  }
>;
