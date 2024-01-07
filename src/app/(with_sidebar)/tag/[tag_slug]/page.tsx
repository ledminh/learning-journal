import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { getTag } from "@/data/api/tag";
import { MaterialOption, mapFilterToMaterial } from "@/ui/types";
import { ITEMS_PER_PAGE } from "@/constants";

interface Props {
  params: {
    tag_slug: string;
  };
  searchParams: {
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
    material?: MaterialOption;
    keyword?: string;
  };
}

export default async function TagPage(props: Props) {
  const sort = {
    by: props.searchParams.sortBy ?? "date",
    order: props.searchParams.order ?? "desc",
  };

  const { errorMessage, payload } = await getTag({
    slug: props.params.tag_slug,
    offset: 0,
    limit: ITEMS_PER_PAGE,
    filters: {
      keyword: props.searchParams.keyword,
      materialType: props.searchParams.material
        ? mapFilterToMaterial[props.searchParams.material]
        : undefined,
    },
    sort,
  });

  if (errorMessage) {
    return (
      <p className="p-2 text-red-700 bg-red-200 border border-red-700 rounded-lg">
        {errorMessage}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="p-2 text-xl text-white bg-neutral-500">
        <span className="font-bold">Tag:</span>{" "}
        <span className="font-mono">{payload!.tag.name}</span>
      </h3>
      <ul className="flex flex-col gap-2">
        {payload!.tag.journalEntries.map((jE) => (
          <li key={jE.id}>
            <Link href={`/entry/${jE.slug}`}>
              <JournalEntry type="summary" journalEntry={jE} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
