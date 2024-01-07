import { getTag } from "@/data/api/tag";
import { MaterialOption, mapFilterToMaterial, LoadFunction } from "@/ui/types";
import JournalEntryList from "@/ui/JournalList";

interface Props {
  params: {
    tag_slug: string;
  };
  searchParams: {
    keyword?: string;
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
    material?: MaterialOption;
  };
}

export default async function TagPage(props: Props) {
  const { errorMessage, payload } = await getTag({
    slug: props.params.tag_slug,
    offset: 0,
    limit: 0,
  });

  if (errorMessage) {
    return (
      <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
        {errorMessage}
      </p>
    );
  }

  if (!payload) {
    return (
      <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
        No payload when loading tag
      </p>
    );
  }

  const load: LoadFunction = async ({ offset, limit, filters, sort }) => {
    "use server";

    const { errorMessage, payload } = await getTag({
      slug: props.params.tag_slug,
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
        journalEntries: payload.tag.journalEntries,
        total: payload.numJournalEntries,
      },
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="p-2 text-xl text-white bg-neutral-500">
        <span className="font-bold">Tag:</span>{" "}
        <span className="font-mono">{payload!.tag.name}</span>
      </h3>
      <JournalEntryList {...props.searchParams} load={load} />
    </div>
  );
}
