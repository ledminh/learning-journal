import { AsyncFunction } from "@/data/types";
import { Material } from "./material";

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  {
    title: string;
    content: string;
    material: Material;
  },
  {
    description: string;
  }
>;
