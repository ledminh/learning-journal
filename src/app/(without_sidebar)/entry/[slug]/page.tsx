import { getJournalEntry } from "@/data/api/journal_entry";
import Entry from "@/ui/journal_entry";

export default async function EntryPage(props: { params: { slug: string } }) {
  const { errorMessage, payload } = await getJournalEntry({
    slug: props.params.slug,
  });

  if (errorMessage) {
    return (
      <div className="p-2 font-mono text-gray-800 bg-red-200">
        {errorMessage}
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="p-2 font-mono text-gray-800 bg-red-200">
        Entry {props.params.slug} not found
      </div>
    );
  }

  return <Entry type="full" journalEntry={payload} />;
}
