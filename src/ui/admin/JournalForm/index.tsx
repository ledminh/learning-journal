"use client";

import { useState, FC } from "react";
import AddTags from "./AddTags";
import { Tag } from "@/data/server/types/tag";
import {
  DataToConnectTag,
  JournalEntry,
} from "@/data/server/types/journal_entry";
import Description from "./Description";
import MaterialComponent from "./Material";
import Content from "./Content";

import { DataToCreateMaterial, Material } from "@/data/server/types/material";
import { addJournalEntry } from "@/data/api_call/addJournalEntry";

import { isMaterial } from "@/ui/utils";

import { useRouter } from "next/navigation";
import Spinner from "@/ui/Spinner";
import { updateJournalEntry } from "@/data/api_call/updateJournalEntry";

const JournalForm: FC<{
  dbTags: Tag[];
  journalEntry?: JournalEntry;
}> = function ({ dbTags, journalEntry }) {
  const [title, setTitle] = useState(journalEntry?.title ?? "");

  const [dtaCTags, setDtaCTags] = useState<DataToConnectTag[]>(
    journalEntry
      ? journalEntry.tags.map((tag) => {
          const tagObj = dbTags.find((t) => t.name === tag)!;

          return {
            id: tagObj.id,
            name: null,
          };
        })
      : []
  );

  const [description, setDescription] = useState(
    journalEntry?.description ?? ""
  );

  const [material, setMaterial] = useState<
    DataToCreateMaterial | Material | null
  >(journalEntry?.material ?? null);

  const [content, setContent] = useState(journalEntry?.content ?? "");

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

    const materialData = isMaterial(material)
      ? { id: material.id }
      : {
          id: null,
          ...material!,
        };

    // UPDATE
    if (journalEntry) {
      const data = {
        id: journalEntry.id,
        slug: journalEntry.slug,
        title,
        description,
        material: materialData,
        content,
        tags: dtaCTags,
      };

      const { errorMessage } = await updateJournalEntry(data);

      if (errorMessage) {
        return setErrorMessage(errorMessage);
      }
    } else {
      // CREATE
      const data = {
        title,
        description,
        material: material as DataToCreateMaterial,
        content,
        tags: dtaCTags,
      };

      const { errorMessage } = await addJournalEntry(data);

      if (errorMessage) {
        return setErrorMessage(errorMessage);
      }
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

      <label className="flex flex-col gap-4 p-2 border-2 border-black rounded-lg shadow-lg">
        <span className="font-semibold border-b-2 border-b-black">
          Material
        </span>
        <MaterialComponent setMaterial={setMaterial} material={material} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold">Content</span>
        <Content content={content} setContent={setContent} />
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
      {errorMessage && <span className="text-red-500">{errorMessage}</span>}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <button
          className="flex flex-row items-center justify-center gap-2 p-2 font-semibold text-white bg-blue-500 sm:basis-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isJEValid()}
          onClick={onSubmit}
        >
          <span>Submit</span>
          {isSubmitting && <Spinner />}
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
