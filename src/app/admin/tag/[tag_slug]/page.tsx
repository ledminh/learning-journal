import JournalList from "@/ui/admin/JournalList/JournalList";

export default function TagPage() {
  return (
    <div className="flex flex-col gap-4">
      <section className="flex gap-4 justify-start items-center">
        <h2 className="font-semibold text-lg">Tag 1</h2>
        <button className="bg-neutral-500 py-1 px-2 text-white">rename</button>
        <button className="bg-red-900 py-1 px-2 text-white">empty</button>
        <button className="bg-red-900/50 py-1 px-2 text-white">delete</button>
      </section>
      <section>
        <JournalList />
      </section>
    </div>
  );
}
