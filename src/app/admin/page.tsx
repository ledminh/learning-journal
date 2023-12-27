import JournalList from "@/ui/admin/JournalList";
import TagSection from "@/ui/admin/TagSection";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <TagSection />
      <JournalList />
    </div>
  );
}
