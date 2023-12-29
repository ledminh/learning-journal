"use client";

import { useState, FC } from "react";
import AddTags from "./AddTags";
import { Tag } from "@/data/server/types/tag";
import { DataToConnectTag } from "@/data/server/types/journal_entry";
import Description from "./Description";
import Material from "./Material";

const JournalForm: FC<{
  dbTags: Tag[];
}> = function ({ dbTags }) {
  const [title, setTitle] = useState("");
  const [dtaCTags, setDtaCTags] = useState<DataToConnectTag[]>([]);
  const [description, setDescription] = useState("");

  return (
    <form
      className="flex flex-col gap-10 p-4 border border-black rounded-md shadow-lg"
      onSubmit={(e) => e.preventDefault()}
    >
      <label className="flex flex-col gap-1">
        <span className="text-xl font-semibold">Title</span>
        <input
          type="text"
          className="p-2 text-xl border border-black rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Tags</span>
        <AddTags
          dbTags={dbTags}
          dataToConnectTags={dtaCTags}
          setDataToConnectTags={setDtaCTags}
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Description</span>
        <Description
          description={description}
          setDescription={setDescription}
        />
      </label>
      <label className="flex flex-col gap-4 p-2 border-2 border-black rounded-lg shadow-lg">
        <span className="font-semibold border-b-2 border-b-black">
          Material
        </span>
        <Material />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Content</span>
        <textarea
          className="p-2 bg-gray-100 border border-black resize-none"
          rows={15}
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <button className="p-2 font-semibold text-white bg-blue-500 sm:basis-1/2">
          Submit
        </button>
        <button className="p-2 font-semibold text-white bg-gray-500 sm:basis-1/2">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JournalForm;
