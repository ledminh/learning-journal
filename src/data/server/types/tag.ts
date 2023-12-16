import { JournalEntry } from "./journal_entry";

/************************
 * Data
 */

export type Tag = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  journalEntries: JournalEntry[];
};
