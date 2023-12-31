import JournalList from "@/ui/admin/JournalList";
import TagSection from "@/ui/admin/TagSection";

interface Props {
  searchParams: {
    offset?: number;
    limit?: number;
    keyword?: string;
    sortBy?: "date" | "title";
    order?: "asc" | "desc";
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
