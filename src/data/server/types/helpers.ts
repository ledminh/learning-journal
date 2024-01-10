import { AsyncFunction } from "@/data/types";
import { DataToCreateMaterial } from "./material";
import { DataToUpdateMaterial } from "@/data/api/types";

export type GenerateJournalEntryDescriptionFunction = AsyncFunction<
  {
    title: string;
    content: string;
    material: DataToCreateMaterial | DataToUpdateMaterial;
  },
  {
    description: string;
  }
>;
