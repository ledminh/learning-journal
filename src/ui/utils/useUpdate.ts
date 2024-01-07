import { LoadFunction, MaterialOption, mapFilterToMaterial } from "@/ui/types";

import { JournalEntry } from "@/data/server/types/journal_entry";
import { ITEMS_PER_PAGE } from "@/constants";
import { useEffect, useRef } from "react";

interface UseUpdateProps {
  load: LoadFunction;
  keyword: string | null;
  material: MaterialOption | null;
  sortBy: "date" | "title" | null;
  order: "asc" | "desc" | null;
  setJournalEntries: (journalEntries: JournalEntry[]) => void;
  setTotal: (total: number) => void;
  setIsRefeshing: (isRefeshing: boolean) => void;
  page?: number;
}

const useUpdate = ({
  load,
  keyword,
  material,
  sortBy,
  order,
  setJournalEntries,
  setTotal,
  setIsRefeshing,
  page,
}: UseUpdateProps) => {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const update = async () => {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        return;
      }

      const { errorMessage, payload } = await load({
        offset: page ? (page - 1) * ITEMS_PER_PAGE : 0,
        limit: ITEMS_PER_PAGE,
        filters: {
          keyword: keyword ?? undefined,
          materialType: material ? material : undefined,
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

      setJournalEntries(payload.journalEntries);

      setTotal(payload.total);
    };

    setIsRefeshing(true);
    update().then(() => setIsRefeshing(false));
  }, [keyword, material, sortBy, order, page]);
};

export default useUpdate;
