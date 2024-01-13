import { getTag } from "@/data/api/tag";
import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";

interface Props {
  params: {
    tag_slug: string;
  };
}

export default async function TagPage({ params }: Props) {
  const { errorMessage, payload } = await getTag({
    slug: params.tag_slug,
    sort: {
      by: "date",
      order: "desc",
    },
  });

  if (errorMessage) {
    return <div className="p-2 font-mono bg-red-200">{errorMessage}</div>;
  }

  if (!payload) {
    return (
      <div>
        <p className="font-mono bg-red-200">Cannot load payload</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-wrap items-center justify-start gap-10">
        <h2 className="text-xl font-semibold text-blue-800 border-b-4 border-b-blue-800">
          TAG: {payload.tag.name}
        </h2>
        <div className="flex items-center justify-start gap-2">
          <button className="px-2 py-1 text-white bg-neutral-500">
            rename
          </button>
          <button className="px-2 py-1 text-white bg-red-900">empty</button>
          <button className="px-2 py-1 text-white bg-red-900/50">delete</button>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Journal Entries</h3>
        <JournalList journalEntries={payload.tag.journalEntries} />
      </section>
    </div>
  );
}

/***************************
 * Components
 */

const JournalList: React.FC<{ journalEntries: JournalEntry[] }> = ({
  journalEntries,
}) => {
  return (
    <ul className="flex flex-col gap-2">
      {journalEntries.length > 0 ? (
        journalEntries.map((journalEntry, index) => (
          <li key={journalEntry.id}>
            <Link
              href={`/admin/edit-journal/${journalEntry.slug}`}
              className={`flex items-center justify-between p-2 hover:bg-blue-400 ${
                index % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
              }`}
            >
              <span className="font-semibold">{journalEntry.title}</span>
              <span>{journalEntry.createdAt.toLocaleDateString("en-US")}</span>
            </Link>
          </li>
        ))
      ) : (
        <li className="p-2 font-mono bg-red-200">No journal entries found</li>
      )}
    </ul>
  );
};
