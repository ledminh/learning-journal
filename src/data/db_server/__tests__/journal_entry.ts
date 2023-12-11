import {
  addJournalEntry,
  getJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/data/db_server/journal_entry";

import { createAndAddDate } from "@/data/db_server/date";

import { MaterialType } from "@/types/material";
import { addTags } from "../tag";

describe("Journal Entry functions", () => {
  it("should add a journal entry with Link Material", async () => {
    const date = await createAndAddDate({});

    const dataToAddTags = [
      {
        name: "Test Link 1",
        slug: "test-link-1",
      },
      {
        name: "Test Link 2",
        slug: "test-link-2",
      },
    ];

    const tags = await addTags(dataToAddTags);

    expect(tags.errorMessage).toBeNull();

    const dataToAddLinkJE = {
      title: "Test Link",
      slug: "test-link",
      description: "Test Link Description",
      content:
        "This is a test link journal entry. It should have a link material.",
      material: {
        type: MaterialType.Link,
        content: "https://www.google.com",
      },
      tagIDs: tags.payload?.map((tag) => tag.id) as string[],
      date: {
        id: date.payload?.id as string,
      },
    };

    const linkJE = await addJournalEntry(dataToAddLinkJE);

    expect(linkJE.errorMessage).toBeNull();

    expect(linkJE.payload).toBe({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      title: dataToAddLinkJE.title,
      slug: dataToAddLinkJE.slug,
      description: dataToAddLinkJE.description,
      material: {
        id: expect.any(String),
        type: MaterialType.Link,
        content: "https://www.google.com",
        createdAt: expect.any(Date),
      },
      content: dataToAddLinkJE.content,
      tags: tags.payload?.map((tag) => tag.name) as string[],
    });
  });
});
