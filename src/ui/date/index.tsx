import Link from "next/link";
import Block from "@/ui/layout/Block";
import { formatDateString } from "@/utils/dateFunctions";
import { DateEntry } from "@/data/server/types/date";

type Props = {
  errorMessage: string | null;
  dateEntries: DateEntry[] | null;
};

export async function DateBlock({ errorMessage, dateEntries }: Props) {
  return (
    <Block title="Date">
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {dateEntries && (
        <div className="flex flex-col gap-4">
          <ul>
            {dateEntries.map((dateEntry) => (
              <li key={dateEntry.id}>
                <Link
                  href={`/date/${formatDateString(dateEntry.date)
                    .replace(/[ ,]/g, "-")
                    .replace(/-{2,}/g, "-")}`}
                  className="font-mono underline"
                >
                  {formatDateString(dateEntry.date)}
                </Link>
              </li>
            ))}
          </ul>
          <div>
            <Link href="/dates" className="font-mono text-blue-800 underline">
              View all dates
            </Link>
          </div>
        </div>
      )}
    </Block>
  );
}
