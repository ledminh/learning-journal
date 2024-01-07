import JournalEntryList from "@/ui/JournalList";
import { LoadFunction, MaterialOption, mapFilterToMaterial } from "@/ui/types";
import { getJournalEntries } from "@/data/api/journal_entry";

interface Props {
  searchParams: {
    keyword?: string;
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
    material?: MaterialOption;
  };
}

export default function Home({ searchParams }: Props) {
  return <JournalEntryList {...searchParams} load={load} />;
}

/**********************
 * Helpers
 */

const load: LoadFunction = async ({ offset, limit, filters, sort }) => {
  "use server";

  const { errorMessage, payload } = await getJournalEntries({
    offset,
    limit,
    filters: {
      keyword: filters?.keyword,
      materialType: filters?.materialType
        ? mapFilterToMaterial[filters.materialType]
        : undefined,
    },
    sort,
  });

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  if (!payload) {
    return { errorMessage: "No payload", payload: null };
  }

  return {
    errorMessage: null,
    payload: {
      journalEntries: payload.journalEntries,
      total: payload.total,
    },
  };
};
