import JournalForm from "@/ui/admin/JournalForm";
import { getTags } from "@/data/api/tag";
import { getJournalEntry } from "@/data/api/journal_entry";

interface Props {
  params: {
    journal_slug: string;
  };
}

export default async function EditJournalPage({ params }: Props) {
  const { errorMessage, payload } = await getData(params);

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

  const { dbTags, journalEntry } = payload;

  return (
    <div className="flex flex-col gap-4">
      <section className="flex items-center justify-between gap-4 p-2 bg-neutral-200">
        <h2 className="text-lg font-semibold">{journalEntry.title}</h2>
        <button className="px-2 py-1 text-white bg-red-900">delete</button>
      </section>
      <JournalForm dbTags={dbTags} journalEntry={journalEntry} />
    </div>
  );
}

/****************************
 * Helpers
 */
async function getData(props: { journal_slug: string }) {
  const [dbTagsPL, journalEntryPL] = await Promise.all([
    getTags({}),
    getJournalEntry({
      slug: props.journal_slug,
    }),
  ]);

  if (dbTagsPL.errorMessage) {
    return {
      errorMessage: dbTagsPL.errorMessage,
      payload: null,
    };
  }

  if (journalEntryPL.errorMessage) {
    return {
      errorMessage: journalEntryPL.errorMessage,
      payload: null,
    };
  }

  if (!dbTagsPL.payload || !journalEntryPL.payload) {
    return {
      errorMessage: "Cannot load dbTags or journalEntry",
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      dbTags: dbTagsPL.payload,
      journalEntry: journalEntryPL.payload,
    },
  };
}
