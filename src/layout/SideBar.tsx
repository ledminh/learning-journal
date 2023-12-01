import { FilterBlock } from "@/filter";
import { TagBlock } from "@/tag";
import { DateBlock } from "@/date";
import { SortBlock } from "@/sort";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-4">
      <TagBlock />
      <DateBlock />
      <SortBlock />
      <FilterBlock />
    </div>
  );
}
