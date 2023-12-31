"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useQueryString from "../utils/useQueryString";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  const { updateQueryString } = useQueryString();
  const pathname = usePathname();

  return (
    <input
      type="text"
      className="p-2 border border-neutral-700 basis-1/2"
      placeholder="Search ..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchTerm !== "") {
          const newQueryString = updateQueryString({
            keyword: searchTerm,
          });

          router.push(`${pathname}?${newQueryString}`);
          setSearchTerm("");
        }
      }}
    />
  );
};

export default SearchBar;
