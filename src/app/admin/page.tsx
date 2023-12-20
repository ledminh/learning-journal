import JournalList from "@/ui/admin/JournalList";
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
      <JournalList />
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
