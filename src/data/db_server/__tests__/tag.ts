import {
  addTags,
  getTag,
  getTags,
  updateTag,
  removeJournalEntryFromTag,
  emptyTag,
  deleteTag,
} from "@/data/db_server/tag";

import { TagEntry } from "@/types/tag";

describe("Tag functions", () => {
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

  it("should add tags to the database", async () => {
    const result = await addTags(tagsToAdd);

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

  it("should get a tag from the database with empty journalEntries", async () => {
    const result = await getTag({ name: "tag1" });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual({
      id: expect.any(String),
      name: "tag1",
      slug: "tag1",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const result2 = await getTag({ name: "tag2" });

    expect(result2.errorMessage).toEqual(null);
    expect(result2.payload).toEqual({
      id: expect.any(String),
      name: "tag2",
      slug: "tag2",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const result3 = await getTag({ name: "tag3" });

    expect(result3.errorMessage).toEqual(null);
    expect(result3.payload).toEqual({
      id: expect.any(String),
      name: "tag3",
      slug: "tag3",
      journalEntries: [],
      createdAt: expect.any(Date),
    });
  });

  it.skip("should get a tag from the database with journalEntries", async () => {});
  it.skip("should get a tag from the database with journalEntries being sorted", async () => {});
  it.skip("should get a tag from the database with journalEntries being filtered", async () => {});

  it("should get all tags from the database. No sorted.", async () => {
    const result = await getTags({});

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result2 = await getTags({ names: ["tag1", "tag2"] });

    expect(result2.errorMessage).toEqual(null);
    expect(result2.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get all tags from the database. Sorted by name. Ascending.", async () => {
    const result = await getTags({
      options: {
        sort: {
          by: "name",
          order: "asc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get all tags from the database. Sorted by name. Descending.", async () => {
    const result = await getTags({
      options: {
        sort: {
          by: "name",
          order: "desc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by name. Ascending.", async () => {
    const result = await getTags({
      names: ["tag1", "tag3"],
      options: {
        sort: {
          by: "name",
          order: "asc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by name. Descending.", async () => {
    const result = await getTags({
      names: ["tag1", "tag3"],
      options: {
        sort: {
          by: "name",
          order: "desc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by createdAt. Ascending.", async () => {
    await addTags([{ name: "lastAddedTag", slug: "lastAddedTag" }]);

    const result = await getTags({
      names: ["tag1", "lastAddedTag"],
      options: {
        sort: {
          by: "date",
          order: "asc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by createdAt. Descending.", async () => {
    const result = await getTags({
      names: ["tag1", "lastAddedTag"],
      options: {
        sort: {
          by: "date",
          order: "desc",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get all tags from the database. Filtered by date.", async () => {
    const result = await getTags({
      options: {
        filters: {
          date: new Date(),
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },

      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },

      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result2 = await getTags({
      options: {
        filters: {
          date: new Date("2025-01-01"),
        },
      },
    });

    expect(result2.errorMessage).toEqual(null);
    expect(result2.payload).toEqual([]);
  });

  it("should get all tags from the database. Filtered by keyword.", async () => {
    const result = await getTags({
      options: {
        filters: {
          keyword: "tag1",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);

    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result2 = await getTags({
      options: {
        filters: {
          keyword: "tag",
        },
      },
    });

    expect(result2.errorMessage).toEqual(null);

    expect(result2.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag1",
        slug: "tag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result3 = await getTags({
      options: {
        filters: {
          keyword: "tag2",
        },
      },
    });

    expect(result3.errorMessage).toEqual(null);

    expect(result3.payload).toEqual([
      {
        id: expect.any(String),
        name: "tag2",
        slug: "tag2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result4 = await getTags({
      options: {
        filters: {
          keyword: "Tag",
        },
      },
    });

    expect(result4.errorMessage).toEqual(null);

    expect(result4.payload).toEqual([
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should update a tag in the database", async () => {
    const { payload: tag1 } = await getTag({ name: "tag1" });

    if (!tag1) throw new Error("tag1 not found");

    const updatedTag1 = await updateTag({
      id: tag1.id,
      name: "updatedTag1",
      slug: "updatedTag1",
      journalEntries: [],
      createdAt: tag1.createdAt,
    });

    expect(updatedTag1.errorMessage).toEqual(null);
    expect(updatedTag1.payload).toEqual({
      id: tag1.id,
      name: "updatedTag1",
      slug: "updatedTag1",
      journalEntries: [],
      createdAt: tag1.createdAt,
    });
  });

  it.skip("should remove a journal entry from a tag", async () => {});
  it.skip("should empty a tag", async () => {});

  it("should delete a tag from the database", async () => {
    const { payload: tag2 } = await getTag({ name: "tag2" });
    if (!tag2) throw new Error("tag2 not found");

    const result = await deleteTag({ name: "tag2" });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual({
      id: tag2.id,
      name: "tag2",
      slug: "tag2",
      journalEntries: [],
      createdAt: tag2.createdAt,
    });

    const result2 = await getTag({ name: "tag2" });

    expect(result2.errorMessage).toEqual("Tag not found.");

    const result3 = await getTags({
      options: {
        sort: {
          by: "name",
          order: "asc",
        },
      },
    });

    expect(result3.errorMessage).toEqual(null);

    expect(result3.payload).toEqual([
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "updatedTag1",
        slug: "updatedTag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result4 = await getTags({
      options: {
        sort: {
          by: "name",
          order: "desc",
        },
      },
    });

    expect(result4.errorMessage).toEqual(null);

    expect(result4.payload).toEqual([
      {
        id: expect.any(String),
        name: "updatedTag1",
        slug: "updatedTag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },

      {
        id: expect.any(String),
        name: "tag3",
        slug: "tag3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "lastAddedTag",
        slug: "lastAddedTag",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should delete all tags from the database", async () => {
    await deleteTag({ name: "updatedTag1" });
    await deleteTag({ name: "tag3" });
    await deleteTag({ name: "lastAddedTag" });

    const result = await getTags({});

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([]);
  });
});
