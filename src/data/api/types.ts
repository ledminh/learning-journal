import { MaterialType } from "@/data/server/types/material";
import { Tag } from "@/data/server/types/tag";
import { AsyncFunction } from "@/data/types";
import { DateEntry } from "../server/types/date";

/**************************
 * Date API
 */

export type GetDateFunction = AsyncFunction<
  {
    date: Date;
  },
  DateEntry
>;

/**************************
 * Tag API
 */
export type GetTagsFunction = AsyncFunction<
  {
    limit?: number;
  },
  Tag[]
>;

export type GetTagFunction = AsyncFunction<
  {
    name: string;
    limit?: number;
    offset?: number;
    sort?: {
      by?: "date" | "title";
      order?: "asc" | "desc";
    };
    filters?: {
      materialType?: MaterialType;
      keyword?: string;
    };
  },
  Tag
>;

export type AddTagsFunction = AsyncFunction<
  {
    names: string[];
  },
  Tag[]
>;

export type UpdateTagFunction = AsyncFunction<
  {
    name: string;
    newName: string;
  },
  Tag
>;

export type EmptyTagFunction = AsyncFunction<
  {
    name: string;
  },
  Tag
>;

export type DeleteTagFunction = AsyncFunction<
  {
    name: string;
  },
  Tag
>;
