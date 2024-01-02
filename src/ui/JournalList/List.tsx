"use client";

import { useState } from "react";
import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";
import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { MaterialOption, SortByOption, SortOrderOption } from "@/ui/types";

import { useSearchParams } from "next/navigation";

import { useUpdate, useMore } from "@/ui/utils";

const List: React.FC<{
  journalEntries: JournalEntryType[];
  total: number;
}> = ({ journalEntries: _journalEntries, total: _total }) => {
  const [journalEntries, setJournalEntries] =
    useState<JournalEntryType[]>(_journalEntries);
  const [total, setTotal] = useState<number>(_total);

  const [isRefeshing, setIsRefeshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const material = searchParams.get("material") as MaterialOption | null;
  const sortBy = searchParams.get("sortBy") as SortByOption | null;
  const order = searchParams.get("order") as SortOrderOption | null;

  useUpdate({
    keyword,
    material,
    sortBy,
    order,
    setJournalEntries,
    setTotal,
    setIsRefeshing,
  });

  const { moreOnlick } = useMore({
    journalEntries,
    keyword,
    material,
    sortBy,
    order,
    setJournalEntries,
    setTotal,
    setIsFetchingMore,
  });

  return (
    <ul className="flex flex-col gap-4">
      {isRefeshing && (
        <div className="flex justify-center">
          <span className="font-bold text-neutral-500">Loading ...</span>
        </div>
      )}
      {journalEntries.map((journalEntry) => (
        <li key={journalEntry.id}>
          <Link href="/entry/01">
            <JournalEntry type="summary" journalEntry={journalEntry} />
          </Link>
        </li>
      ))}
      {isFetchingMore && (
        <li className="flex justify-center">
          <span className="font-bold text-neutral-500">Loading ...</span>
        </li>
      )}
      {journalEntries.length < total && (
        <li className="flex justify-end">
          <button
            className="p-1 text-white bg-neutral-500 hover:bg-neutral-700"
            onClick={moreOnlick}
          >
            more ...
          </button>
        </li>
      )}
    </ul>
  );
};

export default List;
