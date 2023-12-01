import { FilterBlock } from "@/filter";
import { TagBlock } from "@/tag";
import { DateBlock } from "@/date";

export default function SideBar() {
  return (
    <>
      <FilterBlock />
      <TagBlock />
      <DateBlock />
    </>
  );
}
