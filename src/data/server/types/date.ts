import { JournalEntry } from "./journal_entry";

export type DateEntry = {
  id: string;
  date: Date;
  journalEntries: JournalEntry[];
};
