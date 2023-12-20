import Link from "next/link";
import createSlug from "@/utils/createSlug";

export default function JournalList() {
  return (
    <div className="flex flex-col gap-4 items-start border border-neutral-700 p-4 shadow-lg rounded-lg">
      <Link
        href="/admin/add-journal"
        className="border border-neutral-700 p-2 hover:bg-blue-300 inline-block"
      >
        <span>Add New Journal</span>
      </Link>
      <ul className="flex flex-col gap-2 w-full">
        {journals.map((journal) => {
          return (
            <li key={journal.slug} className="border-b border-neutral-700 pb-2">
              <Link
                href={`/admin/edit-journal/${journal.slug}`}
                className="block hover:bg-blue-100 p-2"
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
          <button className="bg-neutral-500 p-1 text-white">more ...</button>
        </li>
      </ul>
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
