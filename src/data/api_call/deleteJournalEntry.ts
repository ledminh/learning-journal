import { DeleteJournalEntryFunction } from "@/data/api/types";
import post from "./post";

const deleteJournalEntry: DeleteJournalEntryFunction = async ({ id }) => {
  const { errorMessage } = await post({
    url: "/api/delete_journal_entry",
    body: {
      id,
    },
    revalidate: true,
  });

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  return {
    errorMessage: null,
    payload: {
      success: true,
    },
  };
};

export default deleteJournalEntry;
