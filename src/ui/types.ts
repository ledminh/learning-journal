import { MaterialType } from "@/data/server/types/material";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { AsyncFunction } from "@/data/types";

export type MaterialOption = "quote" | "code" | "image" | "link";

export const mapFilterToMaterial: Record<MaterialOption, MaterialType> = {
  quote: MaterialType.QUOTE,
  code: MaterialType.CODE,
  image: MaterialType.IMAGE,
  link: MaterialType.LINK,
};

export type SortByOption = "date" | "title";
export type SortOrderOption = "asc" | "desc";

export type LoadFunction = AsyncFunction<
  {
    offset: number;
    limit: number;
    filters?: {
      keyword?: string;
      materialType?: MaterialOption;
    };
    sort: {
      by: SortByOption;
      order: SortOrderOption;
    };
  },
  {
    journalEntries: JournalEntry[];
    total: number;
  }
>;
