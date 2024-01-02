"use client";

import { useState } from "react";
import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";
import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { MaterialOption, SortByOption, SortOrderOption } from "@/ui/types";

import { useSearchParams } from "next/navigation";

import { useUpdate, useMore } from "@/ui/utils";
import { ITEMS_PER_PAGE } from "@/constants";

import Pagination from "@/ui/Pagination";

const List: React.FC<{
  journalEntries: JournalEntryType[];
  total: number;
}> = ({ journalEntries: _journalEntries, total: _total }) => {
  const [journalEntries, setJournalEntries] =
    useState<JournalEntryType[]>(_journalEntries);
  const [total, setTotal] = useState<number>(_total);

  const [isRefeshing, setIsRefeshing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const material = searchParams.get("material") as MaterialOption | null;
  const sortBy = searchParams.get("sortBy") as SortByOption | null;
  const order = searchParams.get("order") as SortOrderOption | null;
  const page = searchParams.get("page");

  useUpdate({
    keyword,
    material,
    sortBy,
    order,
    setJournalEntries,
    setTotal,
    setIsRefeshing,
    page: page ? parseInt(page) : 1,
  });

  return (
    <ul className="flex flex-col gap-4">
      {isRefeshing && (
        <li className="flex justify-center">
          <span className="font-bold text-neutral-500">Loading ...</span>
        </li>
      )}
      {journalEntries.map((journalEntry) => (
        <li key={journalEntry.id}>
          <Link href="/entry/01">
            <JournalEntry type="summary" journalEntry={journalEntry} />
          </Link>
        </li>
      ))}
      {isFetching && (
        <li className="flex justify-center">
          <span className="font-bold text-neutral-500">Loading ...</span>
        </li>
      )}
      {total > ITEMS_PER_PAGE && (
        <li className="flex justify-center">
          <Pagination
            currentPage={page ? parseInt(page) : 1}
            setIsFetching={setIsFetching}
            totalEntries={total}
          />
        </li>
      )}
    </ul>
  );
};

export default List;
