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
            className={`px-4 py-2 border rounded-md text-neutral-500 border-neutral-500 hover:bg-neutral-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
              currentPage === pageNumber ? "bg-neutral-500 text-white" : ""
            }`}
            onClick={onClick}
          >
            {isRefresing && pageNumber === nextIndex ? (
              <Spinner />
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

  if (numberOfPages === 1) return [];

  let pageArray: number[] = [];

  if (numberOfPages <= 4) {
    pageArray = Array.from({ length: numberOfPages }).map(
      (_, index) => index + 1
    );
  } else if (currentPage >= numberOfPages - MAX_PAGES_PER_PAGINATION) {
    pageArray = Array.from({ length: MAX_PAGES_PER_PAGINATION }).map(
      (_, index) => numberOfPages - MAX_PAGES_PER_PAGINATION + index + 1
    );
  } else {
    pageArray = Array.from({ length: MAX_PAGES_PER_PAGINATION }).map(
      (_, index) => currentPage + index
    );
  }

  return pageArray.map((page) => ({
    pageNumber: page,

    onClick: () => {
      setNextIndex(page);
      addQueryString({ page: page + "" });
    },
  }));
}
