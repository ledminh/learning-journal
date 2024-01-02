import { MaterialOption, mapFilterToMaterial } from "@/ui/types";

import { JournalEntry } from "@/data/server/types/journal_entry";
import { getJournalEntries } from "@/data/api_call/getJournalEntries";
import { ITEMS_PER_PAGE } from "@/constants";

interface UseMoreProps {
  journalEntries: JournalEntry[];
  keyword: string | null;
  material: MaterialOption | null;
  sortBy: "date" | "title" | null;
  order: "asc" | "desc" | null;
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
  setTotal: (total: number) => void;
  setIsFetchingMore: (isFetchingMore: boolean) => void;
}

const useMore = ({
  journalEntries,
  keyword,
  material,
  sortBy,
  order,
  setJournalEntries,
  setTotal,
  setIsFetchingMore,
}: UseMoreProps) => {
  return {
    moreOnlick: async () => {
      setIsFetchingMore(true);
      const { errorMessage, payload } = await getJournalEntries({
        offset: journalEntries.length,
        limit: ITEMS_PER_PAGE,
        filters: {
          keyword: keyword ?? undefined,
          materialType: material ? mapFilterToMaterial[material] : undefined,
        },
        sort: {
          by: sortBy ?? "date",
          order: order ?? "desc",
        },
      });

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (payload === null) {
        throw new Error("payload is null");
      }

      setIsFetchingMore(false);

      setJournalEntries([...journalEntries, ...payload.journalEntries]);
      setTotal(payload.total);
    },
  };
};

export default useMore;
