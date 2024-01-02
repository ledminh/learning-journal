import post from "./post";
import { GetJournalEntriesFunction } from "@/data/api/types";

export const getJournalEntries: GetJournalEntriesFunction = async ({
  limit,
  offset,
  filters,
  sort,
}) => {
  const { errorMessage, payload } = await post({
    url: "/api/get_journal_entries",
    body: {
      limit,
      offset,
      filters,
      sort,
    },
  });

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  const { journalEntries, total } = payload as {
    journalEntries: any[];
    total: number;
  };

  return {
    errorMessage: null,
    payload: {
      journalEntries: journalEntries.map((journalEntry) => {
        return {
          id: journalEntry.id,
          slug: journalEntry.slug,
          createdAt: new Date(journalEntry.createdAt),
          updatedAt: new Date(journalEntry.updatedAt),
          title: journalEntry.title,
          description: journalEntry.description,
          material: {
            id: journalEntry.material.id,
            type: journalEntry.material.type,
            content: journalEntry.material.content,
          },
          content: journalEntry.content,
          tags: journalEntry.tags,
        };
      }),
      total,
    },
  };
};
