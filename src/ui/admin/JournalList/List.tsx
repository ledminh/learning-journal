"use client";

import { useState } from "react";
import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { useSearchParams } from "next/navigation";

import getJournalEntries from "@/data/api_call/getJournalEntries";

import { useMore, useUpdate, useQueryString } from "@/ui/utils";

import {
  MaterialOption,
  SortByOption,
  SortOrderOption,
  LoadFunction,
  mapFilterToMaterial,
} from "@/ui/types";

import { formatDateString } from "@/utils/dateFunctions";

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
    load,
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
                  <span className="font-semibold">Created at: </span>
                  {formatDateString(journal.createdAt)}
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
  const { deleteQueryString } = useQueryString();

  const removeKeywordFromUrl = () => {
    deleteQueryString(["keyword"]);
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

/**********************
 * Helpers
 */

const load: LoadFunction = async ({ offset, limit, filters, sort }) => {
  const { errorMessage, payload } = await getJournalEntries({
    offset,
    limit,
    filters: {
      keyword: filters?.keyword,
      materialType: filters?.materialType
        ? mapFilterToMaterial[filters.materialType]
        : undefined,
    },
    sort,
  });

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  if (!payload) {
    return { errorMessage: "No payload", payload: null };
  }

  return {
    errorMessage: null,
    payload: {
      journalEntries: payload.journalEntries,
      total: payload.total,
    },
  };
};
