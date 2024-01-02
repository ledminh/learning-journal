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
      {dateEntries && (
        <div className="flex flex-col gap-4">
          <ul>
            {dateEntries.map((dateEntry) => (
              <li key={dateEntry.id}>
                <Link
                  href={`/date/${formatDateString(dateEntry.date).replace(
                    /[ ,]/g,
                    "-"
                  )}`}
                  className="font-mono underline"
                >
                  {formatDateString(dateEntry.date)}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/dates" className="font-mono text-blue-800 underline">
            View all dates
          </Link>
        </div>
      )}
    </Block>
  );
}
