import post from "./post";
import { GetJournalEntriesFunction } from "../api/types";

export const getJournalEntries: GetJournalEntriesFunction = async ({
  limit,
  offset,
  filters,
  sort,
}) =>
  await post({
    url: "/api/get_journal_entries",
    body: {
      limit,
      offset,
      filters,
      sort,
    },
  });
