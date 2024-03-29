import type { JournalEntry } from "@/data/server/types/journal_entry";
import createSlug from "@/utils/createSlug";
import Link from "next/link";
import Material from "./Material";

import markdown from "@wcj/markdown-to-html";

interface FullEntryProps {
  journalEntry: JournalEntry;
}

export default function FullEntry({ journalEntry }: FullEntryProps) {
  const { title, tags, material, content, createdAt, updatedAt } = journalEntry;

  return (
    <div className="flex flex-col gap-8 p-4 m-auto rounded-lg shadow-sm lg:w-10/12 lg:items-center shadow-black">
      <div className="flex flex-col gap-2 lg:items-center">
        <p className="flex gap-2 font-mono">
          <span className="font-bold">
            {createdAt.toLocaleDateString("en-US")}
          </span>
          {createdAt.toLocaleDateString("en-US") !==
            updatedAt.toLocaleDateString("en-US") && (
            <span className="font-semibold text-gray-400">
              [edited at: {updatedAt.toLocaleDateString("en-US")}]
            </span>
          )}
        </p>
        <h3 className="text-3xl font-semibold text-blue-600">{title}</h3>
      </div>
      <div className="px-2 py-1 text-sm lg:w-full lg:text-center bg-neutral-200">
        <span className="font-bold">Tags: </span>
        {tags.map((tag) => (
          <Link
            key={tag}
            href={"/tag/" + createSlug(tag)}
            className="px-1 text-blue-600 underline"
          >
            {tag}
          </Link>
        ))}
      </div>
      <Material material={material} />
      <section
        dangerouslySetInnerHTML={{ __html: markdown(content) }}
        className="w-full markdown-text"
      />
    </div>
  );
}
