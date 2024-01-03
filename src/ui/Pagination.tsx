import { ITEMS_PER_PAGE, MAX_PAGES_PER_PAGINATION } from "@/constants";
import { useQueryString } from "./utils";
import Spinner from "@/ui/Spinner";

import { useState } from "react";

interface PaginationProps {
  isRefresing: boolean;
  currentPage: number;
  totalEntries: number;
}
const Pagination: React.FC<PaginationProps> = ({
  isRefresing,
  currentPage,
  totalEntries,
}) => {
  const { addQueryString } = useQueryString();

  const [nextIndex, setNextIndex] = useState<number | null>(null);

  return (
    <ul className="flex justify-center gap-2">
      {getPageArray(
        totalEntries,
        currentPage,
        setNextIndex,
        addQueryString
      ).map(({ pageNumber, onClick }) => (
        <li key={pageNumber}>
          <button
            className={`px-4 py-2 h-12  border rounded-md text-neutral-500 border-neutral-500 hover:bg-neutral-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
              currentPage === pageNumber ? "bg-neutral-500 text-white" : ""
            }`}
            onClick={onClick}
          >
            {isRefresing && pageNumber === nextIndex ? (
              <div className="flex items-center justify-center w-full h-full">
                <Spinner className="w-3 h-3" />
              </div>
            ) : (
              <span>{pageNumber}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default Pagination;

/************************
 * Helpers
 */

function getNumberOfPages(totalEntries: number) {
  return Math.ceil(totalEntries / ITEMS_PER_PAGE);
}

function getPageArray(
  totalEntries: number,
  currentPage: number,
  setNextIndex: (index: number) => void,
  addQueryString: (query: Record<string, string>) => void
) {
  const numberOfPages = getNumberOfPages(totalEntries);
  const allPages = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  const currentPagi = Math.ceil(currentPage / MAX_PAGES_PER_PAGINATION);
  const lastPageOfCurrentPagi = currentPagi * MAX_PAGES_PER_PAGINATION;
  const firstPageOfCurrentPagi =
    lastPageOfCurrentPagi - MAX_PAGES_PER_PAGINATION + 1;

  const currentPages: ("next" | "prev" | number)[] = allPages.slice(
    firstPageOfCurrentPagi - 1,
    lastPageOfCurrentPagi
  );

  if (currentPages[0] !== 1) {
    currentPages.unshift("prev");
  }

  if (currentPages[currentPages.length - 1] !== numberOfPages) {
    currentPages.push("next");
  }

  function prevPagi() {
    goToPage(firstPageOfCurrentPagi - 1);
  }

  function nextPagi() {
    goToPage(lastPageOfCurrentPagi + 1);
  }

  function goToPage(page: number) {
    addQueryString({ page: String(page) });
    setNextIndex(page);
  }

  return currentPages.map((page) => ({
    pageNumber: page,

    onClick: () => {
      if (page === "prev") {
        prevPagi();
      } else if (page === "next") {
        nextPagi();
      } else {
        goToPage(page);
      }
    },
  }));
}
