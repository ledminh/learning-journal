"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  return (
    <input
      type="text"
      className="p-2 border border-neutral-700 basis-1/2"
      placeholder="Search ..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && searchTerm !== "") {
          router.push(`/admin?keyword=${searchTerm}`);
          setSearchTerm("");
        }
      }}
    />
  );
};

export default SearchBar;
