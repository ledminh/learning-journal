import { MaterialType } from "@/data/server/types/material";
import postForm from "./postForm";
import { AddJournalEntryFunction } from "@/data/api/types";

export const addJournalEntry: AddJournalEntryFunction = async ({
  title,
  tags,
  description,
  material,
  content,
}) => {
  return await postForm({
    url: "/api/add_journal_entry",
    data: {
      title,
      tags: JSON.stringify(tags),
      description,
      materialType: material.type,
      materialContent:
        material.type === MaterialType.IMAGE
          ? material.content
          : JSON.stringify(material.content),
      content,
    },
  });
};
