import {
  addTags,
  getTag,
  getTags,
  updateTag,
  removeJournalEntryFromTag,
  emptyTag,
  deleteTag,
} from "@/data/db_server/tag";

import {
  addJournalEntry,
  getJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
} from "@/data/db_server/journal_entry";

import { deleteMaterial } from "@/data/db_server/material";

import { TagEntry } from "@/types/tag";

import { MaterialType } from "@/types/material";
import { JournalEntry } from "@/types/journal_entry";
import { createAndAddDate, deleteDate } from "../date";

const data = {
  tags: [
    {
      name: "Test Tag 1",
      slug: "test-tag-1",
    },
    {
      name: "Test Tag 2",
      slug: "test-tag-2",
    },
    {
      name: "Test Tag 3",
      slug: "test-tag-3",
    },
    {
      name: "Test Tag 4",
      slug: "test-tag-4",
    },
  ],
  tagIDs: [] as string[],
  todayID: "",
  yesterdayID: "",
  randomDateID: "",

  today: new Date(),
  yesterday: new Date(new Date().setDate(new Date().getDate() - 1)),
  randomDate: new Date("2025-01-01"),

  journalEntries: [
    {
      title: "Test Journal Entry 1",
      slug: "test-journal-entry-1",
      description: "Test Journal Entry 1 Description",
      content: "Test Journal Entry 1 Content",
      material: {
        type: MaterialType.Link,
        content: "https://www.google.com",
      },
    },
    {
      title: "Test Journal Entry 2",
      slug: "test-journal-entry-2",
      description: "Test Journal Entry 2 Description",
      content: "Test Journal Entry 2 Content",
      material: {
        type: MaterialType.Quote,
        content: "Test Journal Entry 2 Quote",
      },
    },
    {
      title: "Test Journal Entry 3",
      slug: "test-journal-entry-3",
      description: "Test Journal Entry 3 Description",
      content: "Test Journal Entry 3 Content",
      material: {
        type: MaterialType.Image,
        content: "https://www.google.com",
      },
    },
    {
      title: "Test Journal Entry 4",
      slug: "test-journal-entry-4",
      description: "Test Journal Entry 4 Description",
      content: "Test Journal Entry 4 Content",
      material: {
        type: MaterialType.Code,
        content: "Test Journal Entry 4 Quote",
      },
    },
  ],

  jEResults: [] as JournalEntry[],
};

describe.skip("Tag functions", () => {
  afterAll(async () => {
    // Delete all tags

    const allTagsResult = await getTags({});

    if (allTagsResult.errorMessage) throw new Error(allTagsResult.errorMessage);

    const allTags = allTagsResult.payload as TagEntry[];

    const deleteAllTagsResult = await Promise.all(
      allTags.map((tag) => deleteTag({ name: tag.name }))
    );

    deleteAllTagsResult.forEach((result) => {
      if (result.errorMessage) throw new Error(result.errorMessage);
    });

    const allTagsResult2 = await getTags({});

    if (allTagsResult2.errorMessage)
      throw new Error(allTagsResult2.errorMessage);

    expect(allTagsResult2.payload).toEqual([]);

    // Delete all journal entries and materials

    const allJEsResult = await getJournalEntries({});

    if (allJEsResult.errorMessage) throw new Error(allJEsResult.errorMessage);

    const deleteAllJEsResult = await Promise.all([
      ...(allJEsResult.payload as JournalEntry[])
        .map((je) => je.id)
        .map((id) => deleteJournalEntry({ id })),
    ]);

    deleteAllJEsResult.forEach((result) => {
      if (result.errorMessage) throw new Error(result.errorMessage);
    });

    const allJEsResult1 = await getJournalEntries({});

    if (allJEsResult1.errorMessage) throw new Error(allJEsResult1.errorMessage);

    expect(allJEsResult1.payload).toEqual([]);

    const deleteAllMaterialsResult = await Promise.all([
      ...(allJEsResult.payload as JournalEntry[])
        .map((je) => je.material.id)
        .map((id) => deleteMaterial({ id })),
    ]);

    deleteAllMaterialsResult.forEach((result) => {
      if (result.errorMessage) throw new Error(result.errorMessage);
    });

    // delete date
    const deleteDateResults = await Promise.all([
      deleteDate({ date: new Date() }),
      deleteDate({ date: data.yesterday }),
      deleteDate({ date: data.randomDate }),
    ]);

    for (const result of deleteDateResults) {
      if (result.errorMessage) throw new Error(result.errorMessage);
    }
  }, 20000);

  it("should add tags to the database", async () => {
    const addTagsResult = await addTags(data.tags);

    expect(addTagsResult.errorMessage).toEqual(null);

    expect(addTagsResult.payload).toEqual(
      data.tags.map((tag) => ({
        ...tag,
        id: expect.any(String),
        journalEntries: [],
        createdAt: expect.any(Date),
      }))
    );

    data.tagIDs = addTagsResult.payload?.map((tag) => tag.id) as string[];
  }, 20000);

  it("should get a tag from the database with empty journalEntries", async () => {
    const { payload: tag1 } = await getTag({ name: "Test Tag 1" });

    if (!tag1) throw new Error("tag1 not found");

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const { payload: tag2 } = await getTag({ name: "Test Tag 2" });

    if (!tag2) throw new Error("tag2 not found");

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const { payload: tag3 } = await getTag({ name: "Test Tag 3" });

    if (!tag3) throw new Error("tag3 not found");

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const { payload: tag4 } = await getTag({ name: "Test Tag 4" });

    if (!tag4) throw new Error("tag4 not found");

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: [],
      createdAt: expect.any(Date),
    });

    const { payload: tag5 } = await getTag({ name: "Test Tag 5" });

    expect(tag5).toEqual(null);
  });

  it("should get a tag from the database with all journalEntries. Default options (No filters. Title asc, date asc.)", async () => {
    // Adding date and journal entries to be ready to test
    const todayResult = await createAndAddDate({ date: new Date() });

    if (todayResult.errorMessage) throw new Error(todayResult.errorMessage);

    data.todayID = todayResult.payload?.id as string;

    data.jEResults = [];

    const jEArr = data.journalEntries.map((je) => ({
      title: je.title,
      slug: je.slug,
      description: je.description,
      content: je.content,
      material: {
        type: je.material.type,
        content: je.material.content,
      },
      date: { id: data.todayID },
      tagIDs: data.tagIDs,
    }));

    for (let i = 0; i < jEArr.length; i++) {
      const result = await addJournalEntry(jEArr[i]);
      if (result.errorMessage) throw new Error(result.errorMessage);
      data.jEResults.push(result.payload as JournalEntry);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
    });

    expect(errorMessage).toEqual(null);
    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
    });

    expect(errorMessage4).toEqual(null);

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const updatedResult = await updateJournalEntry({
      id: data.jEResults[0].id,
      title: "Test Journal Entry 1",
      slug: "test-journal-entry-1",
      description: "Test Journal Entry 1 Description",
      content: "Test Journal Entry 1 Content",
      material: {
        id: data.jEResults[0].material.id,
        createdAt: data.jEResults[0].material.createdAt,
        type: MaterialType.Link,
        content: "https://www.google.com",
      },
      tagIDs: data.tagIDs.slice(0, 2),
    });

    if (updatedResult.errorMessage) throw new Error(updatedResult.errorMessage);

    const jEs = await getJournalEntries({});

    if (jEs.errorMessage) throw new Error(jEs.errorMessage);

    data.jEResults = jEs.payload as JournalEntry[];

    const { errorMessage: errorMessage5, payload: tag5 } = await getTag({
      name: "Test Tag 4",
    });

    expect(errorMessage5).toEqual(null);

    expect(tag5).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults.slice(1),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage6, payload: tag6 } = await getTag({
      name: "Test Tag 3",
    });

    expect(errorMessage6).toEqual(null);

    expect(tag6).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: data.jEResults.slice(1),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage7, payload: tag7 } = await getTag({
      name: "Test Tag 2",
    });

    expect(errorMessage7).toEqual(null);

    expect(tag7).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage8, payload: tag8 } = await getTag({
      name: "Test Tag 1",
    });

    expect(errorMessage8).toEqual(null);

    expect(tag8).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    // Reset back
    const updatedResult2 = await updateJournalEntry({
      id: data.jEResults[0].id,
      title: "Test Journal Entry 1",
      slug: "test-journal-entry-1",
      description: "Test Journal Entry 1 Description",
      content: "Test Journal Entry 1 Content",
      material: {
        id: data.jEResults[0].material.id,
        createdAt: data.jEResults[0].material.createdAt,
        type: MaterialType.Link,
        content: "https://www.google.com",
      },

      tagIDs: data.tagIDs,
    });

    if (updatedResult2.errorMessage)
      throw new Error(updatedResult2.errorMessage);

    const jEs2 = await getJournalEntries({});

    if (jEs2.errorMessage) throw new Error(jEs2.errorMessage);

    data.jEResults = jEs2.payload as JournalEntry[];

    const { errorMessage: errorMessage9, payload: tag9 } = await getTag({
      name: "Test Tag 4",
    });

    expect(errorMessage9).toEqual(null);

    expect(tag9).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage10, payload: tag10 } = await getTag({
      name: "Test Tag 3",
    });

    expect(errorMessage10).toEqual(null);

    expect(tag10).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage11, payload: tag11 } = await getTag({
      name: "Test Tag 2",
    });

    expect(errorMessage11).toEqual(null);

    expect(tag11).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage12, payload: tag12 } = await getTag({
      name: "Test Tag 1",
    });

    expect(errorMessage12).toEqual(null);

    expect(tag12).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });
  }, 40000);

  it("should get a tag from the database with journalEntries with limit and offset", async () => {
    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
      options: {
        limit: 2,
        offset: 1,
      },
    });

    expect(errorMessage).toEqual(null);

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: data.jEResults.slice(1, 3),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
      options: {
        limit: 3,
        offset: 1,
      },
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: data.jEResults.slice(1, 4),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
      options: {
        limit: 3,
        offset: 2,
      },
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: data.jEResults.slice(2, 4),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
      options: {
        limit: 2,
        offset: 3,
      },
    });

    expect(errorMessage4).toEqual(null);

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults.slice(3, 5),
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage5, payload: tag5 } = await getTag({
      name: "Test Tag 4",
      options: {
        limit: 2,
        offset: 4,
      },
    });

    expect(errorMessage5).toEqual(null);

    expect(tag5).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: [],
      createdAt: expect.any(Date),
    });
  }, 40000);

  it("should get a tag from the database with journalEntries being filtered by date", async () => {
    const addDatesResult = await Promise.all([
      createAndAddDate({ date: data.yesterday }),
      createAndAddDate({ date: data.randomDate }),
    ]);

    addDatesResult.forEach((result) => {
      if (result.errorMessage) throw new Error(result.errorMessage);
    });

    data.yesterdayID = addDatesResult[0].payload?.id as string;
    data.randomDateID = addDatesResult[1].payload?.id as string;

    const jeArr = [
      {
        title: "Yesterday: Test Journal Entry 1",
        slug: "yesterday-test-journal-entry-1",
        description: "Test Journal Entry 1 Description",
        content: "Test Journal Entry 1 Content",
        material: {
          type: MaterialType.Link,
          content: "https://www.google.com",
        },
        date: { id: data.yesterdayID },
        tagIDs: data.tagIDs,
      },
      {
        title: "Random Date: Test Journal Entry 2",
        slug: "random-date-test-journal-entry-2",
        description: "Test Journal Entry 2 Description",
        content: "Test Journal Entry 2 Content",
        material: {
          type: MaterialType.Quote,
          content: "Test Journal Entry 2 Quote",
        },
        date: { id: data.randomDateID },
        tagIDs: data.tagIDs,
      },
    ];

    for (let i = 0; i < jeArr.length; i++) {
      const result = await addJournalEntry(jeArr[i]);
      if (result.errorMessage) throw new Error(result.errorMessage);
      data.jEResults.push(result.payload as JournalEntry);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
      options: {
        filters: {
          date: data.yesterday,
        },
      },
    });

    expect(errorMessage).toEqual(null);

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [data.jEResults[4]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
      options: {
        filters: {
          date: data.yesterday,
        },
      },
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: [data.jEResults[4]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
      options: {
        filters: {
          date: data.yesterday,
        },
      },
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: [data.jEResults[4]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
      options: {
        filters: {
          date: data.randomDate,
        },
      },
    });

    expect(errorMessage4).toEqual(null);

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: [data.jEResults[5]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage5, payload: tag5 } = await getTag({
      name: "Test Tag 4",
      options: {
        filters: {
          date: data.today,
        },
      },
    });

    expect(errorMessage5).toEqual(null);

    expect(tag5).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults.slice(0, 4),
      createdAt: expect.any(Date),
    });
  }, 40000);

  it("should get a tag from the database with journalEntries being filtered by materialType", async () => {
    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
      options: {
        filters: {
          materialType: MaterialType.Link,
        },
      },
    });

    expect(errorMessage).toEqual(null);

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [data.jEResults[0], data.jEResults[4]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
      options: {
        filters: {
          materialType: MaterialType.Quote,
        },
      },
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: [data.jEResults[5], data.jEResults[1]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
      options: {
        filters: {
          materialType: MaterialType.Image,
        },
      },
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: [data.jEResults[2]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
      options: {
        filters: {
          materialType: MaterialType.Code,
        },
      },
    });

    expect(errorMessage4).toEqual(null);

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: [data.jEResults[3]],
      createdAt: expect.any(Date),
    });
  });

  it("should get a tag from the database with journalEntries being filtered by keyword", async () => {
    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
      options: {
        filters: {
          keyword: "1",
        },
      },
    });

    expect(errorMessage).toEqual(null);

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [data.jEResults[0], data.jEResults[4]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
      options: {
        filters: {
          keyword: "2",
        },
      },
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: [data.jEResults[5], data.jEResults[1]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
      options: {
        filters: {
          keyword: "3",
        },
      },
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: [data.jEResults[2]],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
      options: {
        filters: {
          keyword: "4",
        },
      },
    });

    expect(errorMessage4).toEqual(null);

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: [data.jEResults[3]],
      createdAt: expect.any(Date),
    });
  });

  it("should get a tag from the database with journalEntries being sorted", async () => {
    const { errorMessage, payload: tag1 } = await getTag({
      name: "Test Tag 1",
      options: {
        sort: {
          by: "title",
          order: "asc",
        },
      },
    });

    expect(errorMessage).toEqual(null);

    expect(tag1).toEqual({
      id: expect.any(String),
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [
        data.jEResults[5],
        ...data.jEResults.slice(0, 4),
        data.jEResults[4],
      ],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage2, payload: tag2 } = await getTag({
      name: "Test Tag 2",
      options: {
        sort: {
          by: "title",
          order: "desc",
        },
      },
    });

    expect(errorMessage2).toEqual(null);

    expect(tag2).toEqual({
      id: expect.any(String),
      name: "Test Tag 2",
      slug: "test-tag-2",
      journalEntries: [
        data.jEResults[4],
        ...data.jEResults.slice(0, 4).reverse(),
        data.jEResults[5],
      ],
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage3, payload: tag3 } = await getTag({
      name: "Test Tag 3",
      options: {
        sort: {
          by: "date",
          order: "asc",
        },
      },
    });

    expect(errorMessage3).toEqual(null);

    expect(tag3).toEqual({
      id: expect.any(String),
      name: "Test Tag 3",
      slug: "test-tag-3",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    const { errorMessage: errorMessage4, payload: tag4 } = await getTag({
      name: "Test Tag 4",
      options: {
        sort: {
          by: "date",
          order: "desc",
        },
      },
    });

    expect(errorMessage4).toEqual(null);

    data.jEResults.reverse();

    expect(tag4).toEqual({
      id: expect.any(String),
      name: "Test Tag 4",
      slug: "test-tag-4",
      journalEntries: data.jEResults,
      createdAt: expect.any(Date),
    });

    data.jEResults.reverse();
  });

  it("should get all tags from the database. No sorted.", async () => {
    const result = await getTags({});

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual(
      data.tags.map((tag) => ({
        ...tag,
        id: expect.any(String),
        journalEntries: [],
        createdAt: expect.any(Date),
      }))
    );
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
        name: "Test Tag 1",
        slug: "test-tag-1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 2",
        slug: "test-tag-2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 4",
        slug: "test-tag-4",
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
        name: "Test Tag 4",
        slug: "test-tag-4",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 2",
        slug: "test-tag-2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 1",
        slug: "test-tag-1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by name. Ascending.", async () => {
    const result = await getTags({
      names: ["Test Tag 1", "Test Tag 3"],
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
        name: "Test Tag 1",
        slug: "test-tag-1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get some tags from the database. Sorted by name. Descending.", async () => {
    const result = await getTags({
      names: ["Test Tag 1", "Test Tag 3"],
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
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 1",
        slug: "test-tag-1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should get all tags from the database. Filtered by keyword.", async () => {
    const result = await getTags({
      options: {
        filters: {
          keyword: "3",
        },
      },
    });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual([
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const result2 = await getTags({
      options: {
        filters: {
          keyword: "Test",
        },
      },
    });

    expect(result2.errorMessage).toEqual(null);

    expect(result2.payload).toEqual([
      {
        id: expect.any(String),
        name: "Test Tag 1",
        slug: "test-tag-1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 2",
        slug: "test-tag-2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 4",
        slug: "test-tag-4",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  });

  it("should update a tag in the database", async () => {
    const { payload: tag1 } = await getTag({ name: "Test Tag 1" });

    if (!tag1) throw new Error("tag1 not found");

    const result = await updateTag({
      id: tag1.id,
      name: "updatedTag1",
      slug: "updatedtag1",
      journalEntries: [],
      createdAt: tag1.createdAt,
    });

    expect(result.errorMessage).toEqual(null);

    const jEs = data.jEResults.map((jE) => {
      return {
        id: jE.id,
        title: jE.title,
        slug: jE.slug,
        description: jE.description,
        content: jE.content,
        material: {
          id: jE.material.id,
          createdAt: jE.material.createdAt,
          type: jE.material.type,
          content: jE.material.content,
        },

        createdAt: jE.createdAt,
        updatedAt: jE.updatedAt,
        tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4", "updatedTag1"],
      };
    });

    expect(result.payload).toEqual({
      id: tag1.id,
      name: "updatedTag1",
      slug: "updatedtag1",
      journalEntries: [jEs[5], jEs[0], jEs[1], jEs[2], jEs[3], jEs[4]],
      createdAt: tag1.createdAt,
    });

    const { payload: tag2 } = await getTag({ name: "Test Tag 1" });

    expect(tag2).toEqual(null);

    const { payload: tag3 } = await getTag({ name: "updatedTag1" });

    if (!tag3) throw new Error("tag3 not found");

    expect(tag3).toEqual({
      id: tag1.id,
      name: "updatedTag1",
      slug: "updatedtag1",
      journalEntries: [jEs[5], jEs[0], jEs[1], jEs[2], jEs[3], jEs[4]],
      createdAt: tag1.createdAt,
    });

    const result2 = await getTags({});

    expect(result2.errorMessage).toEqual(null);

    expect(result2.payload).toEqual([
      {
        id: expect.any(String),
        name: "Test Tag 2",
        slug: "test-tag-2",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 4",
        slug: "test-tag-4",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "updatedTag1",
        slug: "updatedtag1",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);

    const { errorMessage: errorMessage } = await getTag({
      name: "Test Tag 1",
    });

    expect(errorMessage).toEqual("Tag not found.");

    const { payload: tag1Back } = await updateTag({
      id: tag1.id,
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [],
      createdAt: tag3.createdAt,
    });

    const jEsBack = jEs.map((jE) => ({
      ...jE,
      tags: ["Test Tag 1", "Test Tag 2", "Test Tag 3", "Test Tag 4"],
    }));

    expect(tag1Back).toEqual({
      id: tag1.id,
      name: "Test Tag 1",
      slug: "test-tag-1",
      journalEntries: [
        jEsBack[5],
        jEsBack[0],
        jEsBack[1],
        jEsBack[2],
        jEsBack[3],
        jEsBack[4],
      ],
      createdAt: tag3.createdAt,
    });
  });

  it("should remove a journal entry from a tag", async () => {
    const { payload: tag1 } = await getTag({ name: "Test Tag 1" });

    if (!tag1) throw new Error("tag1 not found");

    const { payload: tagWithRemovedJE } = await removeJournalEntryFromTag({
      name: tag1.name,
      journalEntryID: data.jEResults[0].id,
    });

    if (!tagWithRemovedJE) throw new Error("tagWithRemovedJE not found");

    expect(tagWithRemovedJE).toEqual({
      id: tag1.id,
      name: tag1.name,
      slug: tag1.slug,
      journalEntries: data.jEResults.slice(1),
      createdAt: tag1.createdAt,
    });

    const { payload: removedJE } = await getJournalEntry({
      slug: data.jEResults[0].slug,
    });

    expect(removedJE).toEqual({
      ...data.jEResults[0],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });
  });

  it("should empty a tag", async () => {
    const { payload: tag1 } = await getTag({ name: "Test Tag 1" });

    if (!tag1) throw new Error("tag1 not found");

    const { payload: tagWithRemovedJE } = await emptyTag({
      name: tag1.name,
    });

    if (!tagWithRemovedJE) throw new Error("tagWithRemovedJE not found");

    expect(tagWithRemovedJE).toEqual({
      id: tag1.id,
      name: tag1.name,
      slug: tag1.slug,
      journalEntries: [],
      createdAt: tag1.createdAt,
    });

    const { payload: removedJE } = await getJournalEntry({
      slug: data.jEResults[1].slug,
    });

    expect(removedJE).toEqual({
      ...data.jEResults[1],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });

    const { payload: removedJE2 } = await getJournalEntry({
      slug: data.jEResults[2].slug,
    });

    expect(removedJE2).toEqual({
      ...data.jEResults[2],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });

    const { payload: removedJE3 } = await getJournalEntry({
      slug: data.jEResults[3].slug,
    });

    expect(removedJE3).toEqual({
      ...data.jEResults[3],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });

    const { payload: removedJE4 } = await getJournalEntry({
      slug: data.jEResults[4].slug,
    });

    expect(removedJE4).toEqual({
      ...data.jEResults[4],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });

    const { payload: removedJE5 } = await getJournalEntry({
      slug: data.jEResults[5].slug,
    });

    expect(removedJE5).toEqual({
      ...data.jEResults[5],
      tags: ["Test Tag 2", "Test Tag 3", "Test Tag 4"],
    });
  }, 120000);

  it("should delete a tag from the database", async () => {
    const { payload: tag1 } = await getTag({ name: "Test Tag 1" });

    if (!tag1) throw new Error("tag1 not found");

    const result = await deleteTag({ name: "Test Tag 1" });

    expect(result.errorMessage).toEqual(null);
    expect(result.payload).toEqual(tag1);

    const { payload: tag1Confirm } = await getTag({ name: "Test Tag 1" });

    expect(tag1Confirm).toEqual(null);

    const { payload: tag2 } = await getTag({ name: "Test Tag 2" });

    if (!tag2) throw new Error("tag2 not found");

    const result2 = await deleteTag({ name: "Test Tag 2" });

    expect(result2.errorMessage).toEqual(null);

    const { payload: tag2Confirm } = await getTag({ name: "Test Tag 2" });

    expect(tag2Confirm).toEqual(null);

    const { payload: jE1 } = await getJournalEntry({
      slug: data.jEResults[0].slug,
    });

    expect(jE1).toEqual({
      ...data.jEResults[0],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: jE2 } = await getJournalEntry({
      slug: data.jEResults[1].slug,
    });

    expect(jE2).toEqual({
      ...data.jEResults[1],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: jE3 } = await getJournalEntry({
      slug: data.jEResults[2].slug,
    });

    expect(jE3).toEqual({
      ...data.jEResults[2],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: jE4 } = await getJournalEntry({
      slug: data.jEResults[3].slug,
    });

    expect(jE4).toEqual({
      ...data.jEResults[3],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: jE5 } = await getJournalEntry({
      slug: data.jEResults[4].slug,
    });

    expect(jE5).toEqual({
      ...data.jEResults[4],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: jE6 } = await getJournalEntry({
      slug: data.jEResults[5].slug,
    });

    expect(jE6).toEqual({
      ...data.jEResults[5],
      tags: ["Test Tag 3", "Test Tag 4"],
    });

    const { payload: allTags } = await getTags({});

    expect(allTags).toEqual([
      {
        id: expect.any(String),
        name: "Test Tag 3",
        slug: "test-tag-3",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        name: "Test Tag 4",
        slug: "test-tag-4",
        journalEntries: [],
        createdAt: expect.any(Date),
      },
    ]);
  }, 120000);
});
