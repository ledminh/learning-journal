import JournalForm from "@/ui/admin/JournalForm";

export default function EditJournalPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold bg-neutral-200 p-2">Edit journal</h2>
      <JournalForm />
    </div>
  );
}
