import { getTag } from "@/data/api/tag";
import RenameTag from "@/ui/admin/RenameTag";
import EmptyTag from "@/ui/admin/EmptyTag";
import TagJournalList from "@/ui/admin/TagJournalList";

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
          <RenameTag tag={payload.tag} />
          <EmptyTag tag={payload.tag} />
          <button className="px-2 py-1 text-white bg-red-900/50">delete</button>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Journal Entries</h3>
        <TagJournalList journalEntries={payload.tag.journalEntries} />
      </section>
    </div>
  );
}
