"use client";

import Block from "@/ui/layout/Block";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { SortByOption, SortOrderOption } from "../types";
import { useQueryString } from "../utils";

export function SortBlock() {
  const searchParams = useSearchParams();

  const currentSortBy = (searchParams.get("sortBy") as SortByOption) || "date";
  const currentOrder = (searchParams.get("order") as SortOrderOption) || "desc";

  const [sortBy, setSortBy] = useState<SortByOption>(currentSortBy);
  const [order, setOrder] = useState<SortOrderOption>(currentOrder);

  useEffect(() => {
    if (currentSortBy !== sortBy) {
      setSortBy(currentSortBy);
    }

    if (currentOrder !== order) {
      setOrder(currentOrder);
    }
  }, [currentSortBy, currentOrder]);

  const { addQueryString } = useQueryString();

  const onSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortByOption);

    addQueryString({ sortBy: e.target.value, page: "1" });
  };

  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as SortOrderOption);

    addQueryString({ order: e.target.value, page: "1" });
  };

  return (
    <Block title="Sort">
      <div className="flex flex-col gap-4">
        <label className="flex items-center gap-4">
          <span className="font-semibold">Sort by</span>
          <select
            name="sortBy"
            className="p-2 border rounded-md border-neutral-600"
            onChange={onSortByChange}
            value={sortBy}
          >
            <option value="date">date</option>
            <option value="title">title</option>
          </select>
        </label>
        <label className="flex items-center gap-4">
          <span className="font-semibold">Order</span>
          <select
            name="order"
            className="p-2 border rounded-md border-neutral-600"
            onChange={onOrderChange}
            value={order}
          >
            <option value="asc">
              {sortBy === "date" ? "oldest first" : "A-Z"}
            </option>
            <option value="desc">
              {sortBy === "date" ? "newest first" : "Z-A"}
            </option>
          </select>
        </label>
      </div>
    </Block>
  );
}
