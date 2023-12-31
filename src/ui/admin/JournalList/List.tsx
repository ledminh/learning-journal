"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { JournalEntry } from "@/data/server/types/journal_entry";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getJournalEntries } from "@/data/api_call/getJournalEntries";

import { MaterialOption, mapFilterToMaterial } from "./types";
import useQueryString from "../utils/useQueryString";
import { ITEMS_PER_PAGE } from "@/constants";

const JournalEntriesList: React.FC<{
  journalEntries: JournalEntry[];
  total: number;
}> = ({ journalEntries: _journalEntries, total: _total }) => {
  const [journalEntries, setJournalEntries] =
    useState<JournalEntry[]>(_journalEntries);
  const [total, setTotal] = useState<number>(_total);

  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const material = searchParams.get("material") as MaterialOption | null;
  const sortBy = searchParams.get("sortBy") as "date" | "title" | null;
  const order = searchParams.get("order") as "asc" | "desc" | null;

  useUpdate(
    journalEntries,
    total,
    keyword,
    material,
    sortBy,
    order,
    setJournalEntries,
    setTotal
  );

  const { moreOnlick } = useMore(
    journalEntries,
    total,
    journalEntries,
    keyword,
    material,
    sortBy,
    order,
    setJournalEntries,
    setTotal
  );

  return (
    <div className="flex flex-col gap-2">
      {keyword && <KeywordTab keyword={keyword} />}
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

/****************************************
 * Hooks
 */
const useUpdate = (
  _journalEntries: JournalEntry[],
  _total: number,
  keyword: string | null,
  material: MaterialOption | null,
  sortBy: "date" | "title" | null,
  order: "asc" | "desc" | null,
  setJournalEntries: (journalEntries: JournalEntry[]) => void,
  setTotal: (total: number) => void
) => {
  useEffect(() => {
    const update = async () => {
      const { errorMessage, payload } = await getJournalEntries({
        offset: 0,
        limit: ITEMS_PER_PAGE,
        filters: {
          keyword: keyword ? keyword : undefined,
          materialType: material ? mapFilterToMaterial[material] : undefined,
        },
        sort: {
          by: sortBy ? sortBy : "date",
          order: order ? order : "desc",
        },
      });

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (payload === null) {
        throw new Error("payload is null");
      }

      setJournalEntries(payload.journalEntries);
      setTotal(payload.total);
    };

    update();
  }, [keyword, material, sortBy, order]);
};

const useMore = (
  _journalEntries: JournalEntry[],
  _total: number,
  journalEntries: JournalEntry[],
  keyword: string | null,
  material: MaterialOption | null,
  sortBy: "date" | "title" | null,
  order: "asc" | "desc" | null,
  setJournalEntries: (journalEntries: JournalEntry[]) => void,
  setTotal: (total: number) => void
) => {
  return {
    moreOnlick: async () => {
      const { errorMessage, payload } = await getJournalEntries({
        offset: journalEntries.length,
        limit: ITEMS_PER_PAGE,
        filters: {
          keyword: keyword ? keyword : undefined,
          materialType: material ? mapFilterToMaterial[material] : undefined,
        },
        sort: {
          by: sortBy ? sortBy : "date",
          order: order ? order : "desc",
        },
      });

      if (errorMessage) {
        throw new Error(errorMessage);
      }

      if (payload === null) {
        throw new Error("payload is null");
      }

      setJournalEntries([...journalEntries, ...payload.journalEntries]);
      setTotal(payload.total);
    },
  };
};
