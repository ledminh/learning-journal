import { ITEMS_PER_PAGE } from "@/constants";
import { useQueryString } from "./utils";

interface PaginationProps {
  currentPage: number;
  totalEntries: number;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
}
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalEntries,
  setIsFetching,
}) => {
  const { addQueryString } = useQueryString();

  const getNumberOfPages = () => {
    return Math.ceil(totalEntries / ITEMS_PER_PAGE);
  };

  const onClick = () => {
    setIsFetching(true);
    addQueryString({ page: currentPage + 1 + "" });
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: getNumberOfPages() }).map((_, index) => (
        <button
          key={index}
          className="px-4 py-2 border rounded-md text-neutral-500 border-neutral-500 hover:bg-neutral-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          onClick={onClick}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
