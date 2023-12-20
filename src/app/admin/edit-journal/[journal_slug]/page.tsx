import JournalForm from "@/ui/admin/JournalForm";

export default function EditJournalPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex bg-neutral-200 gap-4 justify-between items-center p-2">
        <h2 className="font-semibold text-lg">Journal 1</h2>
        <button className="bg-red-900 py-1 px-2 text-white">delete</button>
      </section>
      <JournalForm />
    </div>
  );
}
