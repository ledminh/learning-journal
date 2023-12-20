import createSlug from "@/utils/createSlug";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-blue-200 p-4 rounded-xl flex flex-col gap-2 justify-start items-start">
        <button className="border border-neutral-700 p-2 hover:bg-blue-300">
          <span>Add New Tag</span>
        </button>
        <ul>
          {tags.map((tag) => {
            return (
              <li key={tag.slug} className="inline-block mr-2 mt-2">
                <Link
                  href={`/admin/tag/${tag.slug}`}
                  className="border border-neutral-700 px-2 hover:bg-neutral-200 rounded-xl"
                >
                  <span>{tag.name}</span>
                </Link>
              </li>
            );
          })}
          <li className="inline-block mr-2 mt-2">
            <button className="bg-blue-500 text-white px-2 rounded-xl hover:bg-blue-800 text-sm">
              more ...
            </button>
          </li>
        </ul>
      </div>
      <div className="h-[1px] bg-neutral-700" />
      <div className="flex flex-col gap-4 items-start border border-neutral-700 p-4 shadow-lg rounded-lg">
        <Link
          href="/add-journal"
          className="border border-neutral-700 p-2 hover:bg-blue-300 inline-block"
        >
          <span>Add New Journal</span>
        </Link>
        <ul className="flex flex-col gap-2 w-full">
          {journals.map((journal) => {
            return (
              <li
                key={journal.slug}
                className="border-b border-neutral-700 pb-2"
              >
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
    </div>
  );
}

/**********************
 * Sample data
 */
const tags = [
  {
    slug: "tag-1",
    name: "Tag 1",
  },
  {
    slug: "tag-2",
    name: "Tag 2",
  },
  {
    slug: "tag-3",
    name: "Tag 3",
  },
  {
    slug: "tag-4",
    name: "Tag 4",
  },
  {
    slug: "tag-5",
    name: "Tag 5",
  },
  {
    slug: "tag-6",
    name: "Tag 6",
  },
  {
    slug: "tag-7",
    name: "Tag 7",
  },
  {
    slug: "tag-8",
    name: "Tag 8",
  },
  {
    slug: "tag-9",
    name: "Tag 9",
  },
  {
    slug: "tag-10",
    name: "Tag 10",
  },
  {
    slug: "tag-11",
    name: "Tag 11",
  },
  {
    slug: "tag-12",
    name: "Tag 12",
  },
  {
    slug: "tag-13",
    name: "Tag 13",
  },
  {
    slug: "tag-14",
    name: "Tag 14",
  },
  {
    slug: "tag-15",
    name: "Tag 15",
  },
  {
    slug: "tag-16",
    name: "Tag 16",
  },
  {
    slug: "tag-17",
    name: "Tag 17",
  },
  {
    slug: "tag-18",
    name: "Tag 18",
  },
  {
    slug: "tag-19",
    name: "Tag 19",
  },
  {
    slug: "tag-20",
    name: "Tag 20",
  },
  {
    slug: "tag-21",
    name: "Tag 21",
  },
  {
    slug: "tag-22",
    name: "Tag 22",
  },
  {
    slug: "tag-23",
    name: "Tag 23",
  },
  {
    slug: "tag-24",
    name: "Tag 24",
  },
  {
    slug: "tag-25",
    name: "Tag 25",
  },
  {
    slug: "tag-26",
    name: "Tag 26",
  },
];

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
