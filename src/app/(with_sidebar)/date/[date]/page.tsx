import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";

import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";

export default function DatePage(props: { params: { date: string } }) {
  return (
    <>
      <p>Date {props.params.date}</p>
      <ul className="flex flex-col gap-2">
        {[].map((journalEntry: JournalEntryType) => (
          <li key={journalEntry.id}>
            <Link href="/entry/01">
              <JournalEntry type="summary" journalEntry={journalEntry} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
