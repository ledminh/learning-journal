import JournalList from "@/ui/admin/JournalList";
import { MaterialOption } from "@/ui/admin/JournalList/types";
import TagSection from "@/ui/admin/TagSection";

interface Props {
  searchParams: {
    keyword?: string;
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
    material?: MaterialOption;
  };
}

export default function AdminPage({ searchParams }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <TagSection />
      <JournalList {...searchParams} />
    </div>
  );
}
