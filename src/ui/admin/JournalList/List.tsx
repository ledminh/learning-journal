"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { useSearchParams } from "next/navigation";
import { getJournalEntries } from "@/data/api_call/getJournalEntries";

const JournalEntriesList: React.FC<{
  journalEntries: JournalEntry[];
}> = ({ journalEntries: _journalEntries }) => {
  const [journalEntries, setJournalEntries] =
    useState<JournalEntry[]>(_journalEntries);

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");

  useEffect(() => {
    const update = async () => {
      if (keyword) {
        const { errorMessage, payload } = await getJournalEntries({
          filters: { keyword },
        });

        if (errorMessage) {
          throw new Error(errorMessage);
        }

        setJournalEntries(payload!);
      }
    };

    update();
  }, [keyword]);

  return (
    <ul className="flex flex-col gap-2">
      {journalEntries.map((journal) => {
        return (
          <li key={journal.slug} className="pb-2 border-b border-neutral-700">
            <Link
              href={`/admin/edit-journal/${journal.slug}`}
              className="flex flex-col gap-1 p-2 hover:bg-blue-100"
            >
              <p className="font-bold text-blue-700">{journal.title}</p>
              <p className="text-sm italic">
                <span className="font-bold">Created at: </span>
                {new Date(journal.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs">{journal.description}</p>
            </Link>
          </li>
        );
      })}
      <li className="flex justify-end">
        <button className="p-1 text-white bg-neutral-500">more ...</button>
      </li>
    </ul>
  );
};

export default JournalEntriesList;
