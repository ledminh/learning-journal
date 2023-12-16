import { JournalEntry } from "./journal_entry";

export type Tag = {
  id: string;
  name: string;
  slug: string;
  journalEntries: JournalEntry[];
};
