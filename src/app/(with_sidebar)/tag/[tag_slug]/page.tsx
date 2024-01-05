import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { getTag } from "@/data/api/tag";

export default async function TagPage(props: { params: { tag_slug: string } }) {
  const { errorMessage, payload } = await getTag({
    slug: props.params.tag_slug,
  });

  if (errorMessage) {
    return (
      <div className="p-2 font-mono text-sm bg-red-100">{errorMessage}</div>
    );
  }

  if (!payload) {
    return <div className="p-2 font-mono text-sm bg-red-100">No tag found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="p-2 text-xl text-white bg-neutral-500">
        <span className="font-bold">Tag:</span>{" "}
        <span className="font-mono">{payload.name}</span>
      </h3>
      <ul className="flex flex-col gap-2">
        {payload.journalEntries.map((jE) => (
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
