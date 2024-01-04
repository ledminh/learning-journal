"use client";

import { useState } from "react";
import { useQueryString } from "@/ui/utils";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { addQueryString } = useQueryString();

  return (
    <input
      type="text"
      className="p-2 border border-neutral-700 basis-1/2"
      placeholder="Search ..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchTerm !== "") {
          addQueryString({
            keyword: searchTerm,
            page: "1",
          });

          setSearchTerm("");
        }
      }}
    />
  );
};

export default SearchBar;
