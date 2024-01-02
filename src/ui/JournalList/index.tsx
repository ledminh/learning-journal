import { MaterialOption, mapFilterToMaterial } from "@/ui/types";

import { getJournalEntries } from "@/data/api/journal_entry";
import { ITEMS_PER_PAGE } from "@/constants";
import List from "./List";

interface Props {
  keyword?: string;
  sortBy?: "date" | "title";
  order?: "asc" | "desc";
  material?: MaterialOption;
}

const JournalList: React.FC<Props> = async ({
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
        <List journalEntries={payload.journalEntries} total={payload.total} />
      )}
    </>
  );
};

export default JournalList;
