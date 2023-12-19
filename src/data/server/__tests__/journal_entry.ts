import {
  createJournalEntry,
  convertJournalEntryFromDBServerFunction,
} from "../journal_entry";
import { MaterialType } from "../types/material";

describe.skip("createJournalEntry", () => {
  it("should return a journal entry", () => {
    const journalEntry = createJournalEntry({
      title: "title",
      tags: ["tag1", "tag2"],
      description: "description",
      material: {
        type: MaterialType.CODE,
        content: "console.log('Hello World!')",
      },
      content: "content",
    });
  });
});
