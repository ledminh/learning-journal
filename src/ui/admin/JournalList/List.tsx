"use client";

import { useState } from "react";
import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMore, useUpdate } from "@/ui/utils";

import { MaterialOption, SortByOption, SortOrderOption } from "@/ui/types";

import useQueryString from "../utils/useQueryString";

const JournalEntriesList: React.FC<{
  journalEntries: JournalEntry[];
  total: number;
}> = ({ journalEntries: _journalEntries, total: _total }) => {
  const [journalEntries, setJournalEntries] =
    useState<JournalEntry[]>(_journalEntries);
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
    <div className="flex flex-col gap-2">
      {keyword && <KeywordTab keyword={keyword} />}
      {isRefeshing && (
        <div className="flex justify-center">
          <span className="font-bold text-neutral-500">Loading ...</span>
        </div>
      )}
      <ul className={`flex flex-col gap-2 ${isRefeshing ? "opacity-40" : ""}`}>
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
    </div>
  );
};

export default JournalEntriesList;

/**********************************
 * Components
 */

const KeywordTab: React.FC<{ keyword: string }> = ({ keyword }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { deleteQueryString } = useQueryString();

  const removeKeywordFromUrl = () => {
    router.push(pathname + "?" + deleteQueryString(["keyword"]));
  };

  return (
    <div className="flex items-center justify-between w-full p-2 font-bold bg-blue-100 rounded-lg">
      <div className="flex items-center gap-2">
        <span>Search results for:</span>
        <span className="text-blue-700">{keyword}</span>
      </div>
      <button
        className="p-1 text-white bg-blue-500"
        onClick={removeKeywordFromUrl}
      >
        clear
      </button>
    </div>
  );
};
