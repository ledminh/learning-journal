import Link from "next/link";
import createSlug from "@/utils/createSlug";

export default function JournalList() {
  return (
    <div className="flex flex-col items-start gap-4 p-4 border rounded-lg shadow-lg border-neutral-700">
      <section className="flex flex-col items-center justify-between w-full gap-2 lg:flex-row">
        <div className="flex flex-col w-full gap-2 lg:basis-1/2 sm:flex-row">
          <Link
            href="/admin/add-journal"
            className="inline-block p-2 border border-neutral-700 hover:bg-blue-300 basis-1/2"
          >
            <span>Add New Journal</span>
          </Link>
          <input
            type="text"
            className="p-2 border border-neutral-700 basis-1/2"
            placeholder="Search ..."
          />
        </div>
        <div className="flex flex-col w-full gap-2 lg:basis-1/2 sm:flex-row">
          <button className="p-2 text-white bg-neutral-500 basis-1/2">
            sort by: date - desc
          </button>
          <button className="p-2 text-white bg-neutral-500 basis-1/2">
            filter
          </button>
        </div>
      </section>
      <section className="w-full">
        <ul className="flex flex-col gap-2">
          {journals.map((journal) => {
            return (
              <li
                key={journal.slug}
                className="pb-2 border-b border-neutral-700"
              >
                <Link
                  href={`/admin/edit-journal/${journal.slug}`}
                  className="block p-2 hover:bg-blue-100"
                >
                  <p className="font-bold text-blue-700">{journal.title}</p>
                  <p className="text-sm italic">
                    <span className="font-bold">Created at: </span>
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">{journal.description}</p>
                </Link>
              </li>
            );
          })}
          <li className="flex justify-end">
            <button className="p-1 text-white bg-neutral-500">more ...</button>
          </li>
        </ul>
      </section>
    </div>
  );
}

/*************************
 * Sample data
 */

const getRandomDate = (): string => {
  const start = new Date(2000, 0, 1);
  const end = new Date();
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString();
};

const journals = Array.from({ length: 8 }).map((_, i) => {
  const title = `Journal ${i + 1}`;
  const slug = createSlug(title);

  return {
    title,
    description: `Description for ${title}`,
    slug,
    tags: ["tag-1", "tag-2", "tag-3"],
    createdAt: getRandomDate(),
  };
});
