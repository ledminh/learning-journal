import { FilterBlock } from "@/ui/filter";
import { TagBlock } from "@/ui/tag";
import { DateBlock } from "@/ui/date";
import { SortBlock } from "@/ui/sort";

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
