"use client";

import { useState, FC } from "react";
import AddTags from "./AddTags";
import { Tag } from "@/data/server/types/tag";
import { DataToConnectTag } from "@/data/server/types/journal_entry";
import Description from "./Description";
import MaterialComponent from "./Material";
import Content from "./Content";

import { DataToCreateMaterial } from "@/data/server/types/material";
import { addJournalEntry } from "@/data/api_call/addJournalEntry";
import { useRouter } from "next/navigation";

const JournalForm: FC<{
  dbTags: Tag[];
}> = function ({ dbTags }) {
  const [title, setTitle] = useState("");
  const [dtaCTags, setDtaCTags] = useState<DataToConnectTag[]>([]);
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState<DataToCreateMaterial | null>(null);
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const isJEValid = () =>
    title !== "" &&
    dtaCTags.length > 0 &&
    description !== "" &&
    material !== null &&
    content !== "";

  const onSubmit = async () => {
    if (!isJEValid()) return;

    setIsSubmitting(true);

    const data = {
      title,
      description,
      material: material!,
      content,
      tags: dtaCTags,
    };

    const { errorMessage } = await addJournalEntry(data);

    if (errorMessage) {
      return setErrorMessage(errorMessage);
    }

    setIsSubmitting(false);

    setTitle("");
    setDtaCTags([]);
    setDescription("");
    setMaterial(null);
    setContent("");

    router.push("/admin");
  };

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
          title={title}
          content={content}
          material={material}
        />
      </label>
      <label className="flex flex-col gap-4 p-2 border-2 border-black rounded-lg shadow-lg">
        <span className="font-semibold border-b-2 border-b-black">
          Material
        </span>
        <MaterialComponent setMaterial={setMaterial} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Content</span>
        <Content content={content} setContent={setContent} />
      </label>
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <button
          className="flex flex-row items-center justify-center gap-2 p-2 font-semibold text-white bg-blue-500 sm:basis-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isJEValid()}
          onClick={onSubmit}
        >
          <span>Submit</span>
          {isSubmitting && (
            <svg className="w-5 h-5 ml-2 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0
                  12h4zm2 5.291A7.962 7.962 0 014 12H0c0
                  3.042.546 5.918 1.537 8.544l4.243-1.253zm12.263
                  1.252A7.962 7.962 0 0020 12h-4a7.962 7.962
                  0 00-3.8-6.75l-2.464 2.464zM20.463 4.75A7.962
                  7.962 0 0016 12h4c0-3.042-.546-5.918-1.537-8.544z"
              />
            </svg>
          )}
        </button>
        <button
          className="p-2 font-semibold text-white bg-gray-500 sm:basis-1/2"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JournalForm;
