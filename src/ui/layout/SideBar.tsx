import { FilterBlock } from "@/ui/filter";
import { TagBlock } from "@/ui/tag";
import { DateBlock } from "@/ui/date";
import { SortBlock } from "@/ui/sort";
import { getTags } from "@/data/api/tag";
import { getDates } from "@/data/api/date";

interface SideBarProps {
  tagsLoad: Awaited<ReturnType<typeof getTags>>;
  datesLoad: Awaited<ReturnType<typeof getDates>>;
}

export default function SideBar({ tagsLoad, datesLoad }: SideBarProps) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-4 md:flex-col md:items-start">
      <TagBlock errorMessage={tagsLoad.errorMessage} tags={tagsLoad.payload} />
      <DateBlock
        errorMessage={datesLoad.errorMessage}
        dateEntries={datesLoad.payload}
      />
      <SortBlock />
      <FilterBlock />
    </div>
  );
}
