"use client";

import { useState } from "react";
import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";
import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import { MaterialOption, SortByOption, SortOrderOption } from "@/ui/types";

import { useSearchParams } from "next/navigation";

import { useUpdate } from "@/ui/utils";
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
    <div className="flex flex-col gap-6">
      <ul className="relative flex flex-col gap-4">
        {isRefeshing && (
          <li className="absolute top-0 left-0 flex items-center justify-center w-full h-full p-2 bg-white bg-opacity-80">
            <span className="text-xl font-bold text-blue-900">Loading ...</span>
          </li>
        )}
        {journalEntries.map((journalEntry) => (
          <li key={journalEntry.id} className={isRefeshing ? "opacity-25" : ""}>
            <Link href="/entry/01">
              <JournalEntry type="summary" journalEntry={journalEntry} />
            </Link>
          </li>
        ))}
      </ul>
      {total > ITEMS_PER_PAGE && (
        <li className="flex justify-center">
          <Pagination
            currentPage={page ? parseInt(page) : 1}
            totalEntries={total}
            isRefresing={isRefeshing}
          />
        </li>
      )}
    </div>
  );
};

export default List;
