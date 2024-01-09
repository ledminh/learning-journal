import * as apiDate from "@/data/api/date";
import Link from "next/link";

export default async function DatesPage() {
  const { errorMessage, payload } = await getDates();

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!payload) {
    return <p>No payload</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-bold">List of entries organized by date</h3>
      <ul className="flex flex-col gap-6">
        {payload.dateEntries.map((dateEntry) => (
          <li key={dateEntry.id} className="flex flex-col gap-3">
            <h4 className="p-2 text-xl font-semibold bg-neutral-200">
              {dateEntry.date.toLocaleDateString()}
            </h4>
            <ul className="p-2">
              {dateEntry.journalEntries.map((journalEntry) => (
                <li key={journalEntry.id}>
                  <Link
                    href={"/entry/" + journalEntry.slug}
                    className="text-blue-600 underline"
                  >
                    {journalEntry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*******************************
 * Helpers
 */

async function getDates() {
  const [
    { errorMessage: newestDateErr, payload: newestDatePayload },
    { errorMessage: oldestDateErr, payload: oldestDatePayload },
  ] = await Promise.all([apiDate.getNewestDate({}), apiDate.getOldestDate({})]);

  if (newestDateErr || oldestDateErr) {
    return { errorMessage: newestDateErr || oldestDateErr, payload: null };
  }

  if (!newestDatePayload || !oldestDatePayload) {
    return { errorMessage: "No payload", payload: null };
  }

  const newestDate = newestDatePayload.date;
  const oldestDate = oldestDatePayload.date;

  const newestMonth = newestDate.getMonth();
  const newestYear = newestDate.getFullYear();

  const oldestMonth = oldestDate.getMonth();
  const oldestYear = oldestDate.getFullYear();

  const { errorMessage, payload } = await apiDate.getDates({
    from: new Date(oldestYear, oldestMonth),
    to: new Date(newestYear, newestMonth + 1),
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
      dateEntries: payload,
    },
  };
}
