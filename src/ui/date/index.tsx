import Link from "next/link";
import Block from "@/ui/layout/Block";
import { getDates } from "@/data/api/date";
import { formatDateString } from "@/utils/dateFunctions";

export async function DateBlock() {
  const { errorMessage, payload: dateEntries } = await getDates({
    offset: 0,
    limit: 5,
  });

  return (
    <Block title="Date">
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}

      {dateEntries &&
        dateEntries.map((dateEntry) => (
          <Link
            href={`/date/${formatDateString(dateEntry.date)}`}
            key={dateEntry.id}
            className="font-mono text-blue-800 underline"
          >
            {formatDateString(dateEntry.date)}
          </Link>
        ))}
      <Link href="/dates" className="font-mono text-blue-800 underline">
        View all dates
      </Link>
    </Block>
  );
}
