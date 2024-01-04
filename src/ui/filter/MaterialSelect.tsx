"use client";

import { useQueryString } from "../utils";

const MaterialSelect: React.FC = () => {
  const { addQueryString, deleteQueryString } = useQueryString();

  const onMaterialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === "all") {
      deleteQueryString(["material", "page"]);
    } else {
      addQueryString({ material: value, page: "1" });
    }
  };

  return (
    <select
      className="w-full p-2 border border-gray-300 rounded-md"
      onChange={onMaterialSelect}
    >
      <option value="all">All Materials</option>
      <option value="quote">QUOTE</option>
      <option value="code">CODE</option>
      <option value="link">LINK</option>
      <option value="image">IMAGE</option>
    </select>
  );
};

export default MaterialSelect;
