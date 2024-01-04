"use client";

import Block from "@/ui/layout/Block";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { SortByOption, SortOrderOption } from "../types";
import { useQueryString } from "../utils";

export function SortBlock() {
  const searchParams = useSearchParams();

  const currentSortBy = (searchParams.get("sortBy") as SortByOption) || "date";
  const currentOrder = (searchParams.get("order") as SortOrderOption) || "desc";

  const [sortBy, setSortBy] = useState<SortByOption>(currentSortBy);
  const [order, setOrder] = useState<SortOrderOption>(currentOrder);

  const { addQueryString, deleteQueryString } = useQueryString();

  const onSortByChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortByOption);

    addQueryString({ sortBy: e.target.value });
  };

  const onOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOrder(e.target.value as SortOrderOption);

    addQueryString({ order: e.target.value });
  };

  return (
    <Block title="Sort">
      <label className="flex items-center gap-2">
        <span>Sort by</span>
        <select name="sortBy" onChange={onSortByChange} value={sortBy}>
          <option value="date">date</option>
          <option value="title">title</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span>Order</span>
        <select name="order" onChange={onOrderChange} value={order}>
          <option value="asc">
            {sortBy === "date" ? "oldest first" : "A-Z"}
          </option>
          <option value="desc">
            {sortBy === "date" ? "newest first" : "Z-A"}
          </option>
        </select>
      </label>
    </Block>
  );
}
