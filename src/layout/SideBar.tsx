import { FilterBlock } from "@/filter";
import { TagBlock } from "@/tag";
import { DateBlock } from "@/date";

export default function SideBar() {
  return (
    <div className="flex flex-col gap-4">
      <FilterBlock />
      <TagBlock />
      <DateBlock />
    </div>
  );
}
