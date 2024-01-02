import { ITEMS_PER_PAGE } from "@/constants";
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

  const getNumberOfPages = () => {
    return Math.ceil(totalEntries / ITEMS_PER_PAGE);
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: getNumberOfPages() }).map((_, index) => (
        <button
          key={index}
          className={`px-4 py-2 border rounded-md text-neutral-500 border-neutral-500 hover:bg-neutral-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 ${
            currentPage === index + 1 ? "bg-neutral-500 text-white" : ""
          }`}
          onClick={() => {
            setNextIndex(index + 1);
            addQueryString({ page: index + 1 + "" });
          }}
        >
          {isRefresing && index + 1 === nextIndex ? (
            <Spinner />
          ) : (
            <span>{index + 1}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
