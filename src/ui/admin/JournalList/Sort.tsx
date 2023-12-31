"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useQueryString from "../utils/useQueryString";

const Sort: React.FC<{
  by: "date" | "title";
  order: "asc" | "desc";
}> = ({ by, order }) => {
  const [isVisble, toggle] = useToggle(false);
  const { currentSortBy, currentOrder, options } = useOptions(
    toggle,
    by,
    order
  );

  return (
    <div className="relative basis-1/2">
      <button
        className="block w-full p-2 text-white bg-neutral-500 hover:bg-neutral-700"
        onClick={toggle}
      >
        sort by: {currentSortBy} - {currentOrder}
      </button>
      <div
        className={`${
          isVisble ? "absolute" : "hidden"
        } z-10 w-full p-2 bg-white border rounded-lg shadow-xl border-neutral-700 flex gap-2 flex-wrap justify-between mt-1`}
      >
        {options.map((option) => (
          <button
            key={option.label}
            className={`block p-2 text-white basis-full sm:basis-[48%] lg:basis-full ${
              option.label === currentSortBy + " - " + currentOrder
                ? "bg-neutral-900"
                : "bg-neutral-500"
            } hover:bg-neutral-700`}
            onClick={option.onClick}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sort;

/*************************
 * Hooks
 */

const useToggle = (initialState: boolean) => {
  const [state, setState] = useState(initialState);
  const toggle = () => setState((state) => !state);
  return [state, toggle] as const;
};

const useOptions = (
  toggle: (isVisble: boolean) => void,
  by: "date" | "title",
  order: "asc" | "desc"
) => {
  const options = [
    {
      sortBy: "date",
      order: "desc",
    },
    {
      sortBy: "date",
      order: "asc",
    },
    {
      sortBy: "title",
      order: "desc",
    },
    {
      sortBy: "title",
      order: "asc",
    },
  ];

  const pathname = usePathname();
  const router = useRouter();

  const { updateQueryString } = useQueryString();

  const [currentSortBy, setCurrentSortBy] = useState<string>(by);
  const [currentOrder, setCurrentOrder] = useState<string>(order);

  const onClick = (option: { sortBy: string; order: string }) => {
    router.push(pathname + "?" + updateQueryString(option));
    setCurrentSortBy(option.sortBy);
    setCurrentOrder(option.order);
    toggle(false);
  };

  return {
    currentSortBy,
    currentOrder,
    options: options.map((option) => ({
      label: `${option.sortBy} - ${option.order}`,
      onClick: () => onClick(option),
    })),
  };
};