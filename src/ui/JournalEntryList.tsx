import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { MaterialOption, mapFilterToMaterial } from "@/ui/types";

import { getJournalEntries } from "@/data/api/journal_entry";
import { ITEMS_PER_PAGE } from "@/constants";

interface Props {
  keyword?: string;
  sortBy?: "date" | "title";
  order?: "asc" | "desc";
  material?: MaterialOption;
}

const JournalEntryList: React.FC<Props> = async ({
  keyword,
  sortBy,
  order,
  material,
}) => {
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
    <>
      {errorMessage && (
        <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
          {errorMessage}
        </p>
      )}
      {payload && (
        <ul className="flex flex-col gap-4">
          {payload.journalEntries.map((journalEntry) => (
            <li key={journalEntry.id}>
              <Link href="/entry/01">
                <JournalEntry type="summary" journalEntry={journalEntry} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default JournalEntryList;
