import post from "./post";
import { AddJournalEntryFunction } from "@/data/api/types";

export const addJournalEntry: AddJournalEntryFunction = async ({
  title,
  tags,
  description,
  material,
  content,
}) =>
  await post({
    url: "/api/add_journal_entry",
    body: {
      title,
      tags,
      description,
      material,
      content,
    },
  });
