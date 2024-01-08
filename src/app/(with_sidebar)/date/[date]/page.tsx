import { getDate } from "@/data/api/date";
import { LoadFunction } from "@/ui/types";
import JournalEntryList from "@/ui/JournalList";

export default async function DatePage(props: { params: { date: string } }) {
  const { errorMessage, payload } = await getDate({
    date: new Date(props.params.date),
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
        Date not found
      </p>
    );
  }

  const load: LoadFunction = async () => {
    "use server";

    const { errorMessage, payload } = await getDate({
      date: new Date(props.params.date),
    });

    if (errorMessage) {
      return { errorMessage, payload: null };
    }

    if (payload === null) {
      return { errorMessage: "No payload when loading date", payload: null };
    }

    return {
      errorMessage: null,
      payload: {
        journalEntries: payload.journalEntries,
        total: payload.journalEntries.length,
      },
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="p-2 text-xl text-white bg-neutral-500">
        <span className="font-bold">Date:</span>{" "}
        <span className="font-mono">{payload.date.toLocaleDateString()}</span>
      </h3>
      <JournalEntryList load={load} />
    </div>
  );
}
