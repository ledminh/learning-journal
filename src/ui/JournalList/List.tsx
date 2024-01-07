"use client";

import { useState } from "react";
import type { JournalEntry as JournalEntryType } from "@/data/server/types/journal_entry";
import Link from "next/link";
import JournalEntry from "@/ui/journal_entry";
import {
  LoadFunction,
  MaterialOption,
  SortByOption,
  SortOrderOption,
} from "@/ui/types";

import { useSearchParams } from "next/navigation";

import { useUpdate } from "@/ui/utils";
import { ITEMS_PER_PAGE } from "@/constants";

import Pagination from "@/ui/Pagination";

const List: React.FC<{
  journalEntries: JournalEntryType[];
  total: number;
  load: LoadFunction;
}> = ({ journalEntries: _journalEntries, total: _total, load }) => {
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
    load,
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
      {keyword && (
        <h3 className="p-2 text-xl bg-blue-200">
          <span className="font-bold">Search:</span>{" "}
          <span className="font-mono">"{keyword}"</span>
        </h3>
      )}
      <ul className="relative flex flex-col gap-4">
        {journalEntries.map((journalEntry) => (
          <li key={journalEntry.id}>
            <Link href="/entry/01" className={isRefeshing ? "opacity-20" : ""}>
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
