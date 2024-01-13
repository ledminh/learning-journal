"use client";

import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const TagJournalList: React.FC<{ journalEntries: JournalEntry[] }> = ({
  journalEntries,
}) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <ul className="flex flex-col gap-2">
      {journalEntries.length > 0 ? (
        journalEntries.map((journalEntry, index) => (
          <li key={journalEntry.id}>
            <Link
              href={`/admin/edit-journal/${journalEntry.slug}`}
              className={`flex items-center justify-between p-2 hover:bg-blue-400 ${
                index % 2 === 0 ? "bg-blue-100" : "bg-blue-200"
              }`}
            >
              <span className="font-semibold">{journalEntry.title}</span>
              <span>{journalEntry.createdAt.toLocaleDateString("en-US")}</span>
            </Link>
          </li>
        ))
      ) : (
        <li className="p-2 font-mono bg-red-200">No journal entries found</li>
      )}
    </ul>
  );
};

export default TagJournalList;
