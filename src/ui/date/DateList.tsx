import { DateEntry } from "@/data/server/types/date";
import Link from "next/link";

interface Props {
  dateEntries: DateEntry[];
}

export default function DateList({ dateEntries }: Props) {
  return (
    <ul className="flex flex-col gap-6">
      {dateEntries.map((dateEntry) => (
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
  );
}
