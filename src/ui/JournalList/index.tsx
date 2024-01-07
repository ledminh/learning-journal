"use server";

import {
  MaterialOption,
  SortByOption,
  SortOrderOption,
  LoadFunction,
} from "@/ui/types";

import { ITEMS_PER_PAGE } from "@/constants";
import List from "./List";

interface Props {
  keyword?: string;
  sortBy?: SortByOption;
  order?: SortOrderOption;
  material?: MaterialOption;
  load: LoadFunction;
}

const JournalList: React.FC<Props> = async ({
  keyword,
  sortBy,
  order,
  material,
  load,
}) => {
  const sort = {
    by: sortBy ?? "date",
    order: order ?? "desc",
  };

  const { errorMessage, payload } = await load({
    offset: 0,
    limit: ITEMS_PER_PAGE,
    filters: {
      keyword,
      materialType: material,
    },
    sort,
  });

  return (
    <>
      {errorMessage && (
        <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
          {errorMessage}
        </p>
      )}
      {payload && (
        <List
          journalEntries={payload.journalEntries}
          total={payload.total}
          load={load}
        />
      )}
    </>
  );
};

export default JournalList;
