import postForm from "./postForm";
import { AddJournalEntryFunction } from "@/data/api/types";

import { isMaterial } from "@/ui/utils";
import { MaterialType } from "@/data/server/types/material";

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
        material.type === MaterialType.LINK
          ? JSON.stringify(material.content)
          : material.content,
      content,
    },
  });
};
