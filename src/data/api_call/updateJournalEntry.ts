import { MaterialType } from "@/data/server/types/material";
import postForm from "./postForm";
import { UpdateJournalEntryFunction } from "@/data/api/types";
import { isMaterial } from "@/ui/utils";

export const updateJournalEntry: UpdateJournalEntryFunction = async ({
  id,
  title,
  slug,
  tags,
  description,
  material,
  content,
}) => {
  return await postForm({
    url: "/api/update_journal_entry",
    data: {
      id,
      title,
      slug,
      tags: JSON.stringify(tags),
      description,
      materialID: material.id,
      materialType: isMaterial(material) ? material.type : undefined,
      materialContent: isMaterial(material)
        ? material.type === MaterialType.LINK
          ? JSON.stringify(material.content)
          : material.content
        : undefined,
      content,
    },
  });
};
