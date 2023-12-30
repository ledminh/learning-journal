import JournalList from "@/ui/admin/JournalList";
import TagSection from "@/ui/admin/TagSection";

interface Props {
  searchParams: {
    offset?: number;
    limit?: number;
    keyword?: string;
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
