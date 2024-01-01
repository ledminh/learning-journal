import Link from "next/link";
import { getJournalEntries } from "@/data/api/journal_entry";
import SearchBar from "./SearchBar";

import List from "./List";
import Sort from "./Sort";
import Filter from "./Filter";
import { MaterialOption, mapFilterToMaterial } from "@/ui/types";
import { ITEMS_PER_PAGE } from "@/constants";

interface Props {
  keyword?: string;
  sortBy?: "date" | "title";
  order?: "asc" | "desc";
  material?: MaterialOption;
}

export default async function JournalList({
  keyword,
  sortBy,
  order,
  material,
}: Props) {
  const sort = {
    by: sortBy ?? "date",
    order: order ?? "desc",
  };

  const { errorMessage, payload } = await getJournalEntries({
    offset: 0,
    limit: ITEMS_PER_PAGE,
    filters: {
      keyword,
      materialType: material ? mapFilterToMaterial[material] : undefined,
    },
    sort,
  });

  return (
    <div className="flex flex-col items-start gap-4 p-4 border rounded-lg shadow-lg border-neutral-700">
      <section className="flex flex-col items-center justify-between w-full gap-2 lg:flex-row">
        <div className="flex flex-col w-full gap-2 lg:basis-1/2 sm:flex-row">
          <Link
            href="/admin/add-journal"
            className="inline-block p-2 border border-neutral-700 hover:bg-blue-300 basis-1/2"
          >
            <span>Add New Journal</span>
          </Link>
          <SearchBar />
        </div>
        <div className="flex flex-col w-full gap-2 lg:basis-1/2 sm:flex-row">
          <Sort {...sort} />
          <Filter material={material} />
        </div>
      </section>

      <section className="w-full">
        {errorMessage && (
          <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
            {errorMessage}
          </p>
        )}
        {payload && (
          <List journalEntries={payload.journalEntries} total={payload.total} />
        )}
      </section>
    </div>
  );
}
