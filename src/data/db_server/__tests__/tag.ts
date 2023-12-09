import {
  addOrGetTags,
  getTag,
  getTags,
  updateTag,
  removeJournalEntryFromTag,
  emptyTag,
  deleteTag,
} from "@/data/db_server/tag";

import { TagEntry } from "@/types/tag";

describe("Tag functions", () => {
  it("should add tags to the database", async () => {
    const tagsToAdd = [
      {
        name: "tag1",
        slug: "tag1",
      },
      {
        name: "tag2",
        slug: "tag2",
      },
      {
        name: "tag3",
        slug: "tag3",
      },
    ];

    const result = await addOrGetTags(tagsToAdd);

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toHaveLength(3);

    const payload = result.payload as TagEntry[];

    expect(payload[0].id).toEqual(expect.any(String));
    expect(payload[0].name).toEqual("tag1");
    expect(payload[0].slug).toEqual("tag1");
    expect(payload[0].journalEntries).toEqual([]);
    expect(payload[0].createdAt).toBeInstanceOf(Date);

    expect(payload[1].id).toEqual(expect.any(String));
    expect(payload[1].name).toEqual("tag2");
    expect(payload[1].slug).toEqual("tag2");
    expect(payload[1].journalEntries).toEqual([]);
    expect(payload[1].createdAt).toBeInstanceOf(Date);

    expect(payload[2].id).toEqual(expect.any(String));
    expect(payload[2].name).toEqual("tag3");
    expect(payload[2].slug).toEqual("tag3");
    expect(payload[2].journalEntries).toEqual([]);
    expect(payload[2].createdAt).toBeInstanceOf(Date);
  });

  it("should get tag from the database", async () => {
    const tagsToAdd = [
      {
        name: "tag1",
        slug: "tag1",
      },
      {
        name: "tag2",
        slug: "tag2",
      },
      {
        name: "tag3",
        slug: "tag3",
      },
    ];

    const result = await addOrGetTags(tagsToAdd);

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toHaveLength(3);

    const payload = result.payload as TagEntry[];

    const tag = await getTag(payload[0].id);

    expect(tag.errorMessage).toEqual(null);
    expect(tag.payload).toEqual(payload[0]);
  });
});
