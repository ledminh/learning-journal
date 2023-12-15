import {
  createAndAddDate,
  getDate,
  getDates,
  deleteDate,
} from "@/data/db_server/date";
import { MaterialType } from "@/data/db_server/types/material";
import { getStartOfDate } from "@/utils/dateFunctions";
import {
  addJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
  updateJournalEntry,
} from "../journal_entry";
import { deleteMaterial } from "../material";
import { addTags, deleteTag, getTags } from "../tag";
import { TagEntry } from "@/data/db_server/types/tag";

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
  today: new Date(),
  yesterday: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
  someRandomDay: new Date(2021, 1, 1),
};

describe.skip("Date functions", () => {
  afterAll(async () => {
    const tagsResult = await getTags({});

    if (tagsResult.errorMessage) {
      throw new Error(tagsResult.errorMessage);
    }

    const tags = tagsResult.payload as TagEntry[];

    const deleteTags = await Promise.all([
      ...tags.map((tag) => deleteTag({ name: tag.name })),
    ]);

    expect(deleteTags).toBeDefined();
    expect(deleteTags.every((deleteTag) => deleteTag.errorMessage === null));

    const journalEntries = await getJournalEntries({});

    expect(journalEntries.errorMessage).toBeNull();

    const deleteResults = await Promise.all(
      journalEntries.payload?.map((journalEntry) =>
        deleteJournalEntry({ id: journalEntry.id })
      ) as Promise<any>[]
    );

    if (deleteResults.some((result) => result.errorMessage)) {
      throw new Error("Failed to delete journal entries");
    }

    const materialIDs = deleteResults.map(
      (dR) => dR.payload?.material.id
    ) as string[];

    const journalEntries2 = await getJournalEntries({});

    expect(journalEntries2.errorMessage).toBeNull();
    expect(journalEntries2.payload).toEqual([]);

    const deleteMaterials = await Promise.all(
      materialIDs.map((materialID) => deleteMaterial({ id: materialID }))
    );

    if (deleteMaterials.some((result) => result.errorMessage)) {
      throw new Error("Failed to delete materials");
    }

    expect(deleteMaterials.every((result) => result.payload)).toBeTruthy();
  }, 120000);

  it("should create and add current date", async () => {
    const dbToday = await createAndAddDate({});

    expect(dbToday.errorMessage).toBeNull();

    expect(dbToday.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.today),
      journalEntries: [],
    });
  });

  it("should create and add a random date", async () => {
    const dbYesterday = await createAndAddDate({
      date: data.yesterday,
    });

    expect(dbYesterday.errorMessage).toBeNull();

    expect(dbYesterday.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.yesterday),
      journalEntries: [],
    });

    const dbSomeRandomDay = await createAndAddDate({
      date: data.someRandomDay,
    });

    expect(dbSomeRandomDay.errorMessage).toBeNull();

    expect(dbSomeRandomDay.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.someRandomDay),
      journalEntries: [],
    });
  });

  it("should have unique dates", async () => {
    const dbAnotherToday = await createAndAddDate({});
    expect(typeof dbAnotherToday.errorMessage).toBe("string");

    const dbAnotherYesterday = await createAndAddDate({
      date: data.yesterday,
    });
    expect(typeof dbAnotherYesterday.errorMessage).toBe("string");

    const dbAnotherSomeRandomDay = await createAndAddDate({
      date: data.someRandomDay,
    });
    expect(typeof dbAnotherSomeRandomDay.errorMessage).toBe("string");
  });

  it("should get an empty date", async () => {
    const date = await getDate({ date: data.today });

    expect(date).toBeDefined();
    expect(date.errorMessage).toBeNull();
    expect(date.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.today),
      journalEntries: [],
    });

    const dbYesterday = await getDate({ date: data.yesterday });

    expect(dbYesterday).toBeDefined();
    expect(dbYesterday.errorMessage).toBeNull();
    expect(dbYesterday.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.yesterday),
      journalEntries: [],
    });

    const dbSomeRandomDay = await getDate({ date: data.someRandomDay });

    expect(dbSomeRandomDay).toBeDefined();
    expect(dbSomeRandomDay.errorMessage).toBeNull();
    expect(dbSomeRandomDay.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.someRandomDay),
      journalEntries: [],
    });
  });

  it("should get a date with all journal entries. Default options (Ascending title. No filter.)", async () => {
    const tags = await addTags(data.tags);
    if (tags.errorMessage) {
      throw new Error(tags.errorMessage);
    }

    data.tagIDs = tags.payload?.map((tag) => tag.id) as string[];

    const date = await getDate({ date: new Date() });

    if (date.errorMessage) {
      throw new Error(date.errorMessage);
    }

    const uploadJEResults = await Promise.all(
      data.journalEntries.map((journalEntry) =>
        addJournalEntry({
          ...journalEntry,
          tagIDs: data.tagIDs,
          date: { id: date.payload?.id as string },
        })
      )
    );

    expect(uploadJEResults).toBeDefined();
    expect(uploadJEResults.every((rs) => rs.errorMessage === null));

    const dbDate = await getDate({ date: new Date() });

    expect(dbDate).toBeDefined();
    expect(dbDate.errorMessage).toBeNull();

    const dbJournalEntries = await getJournalEntries({});

    expect(dbJournalEntries).toBeDefined();
    expect(dbJournalEntries.errorMessage).toBeNull();

    expect(dbDate.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: dbJournalEntries.payload,
    });
  }, 20000);

  it("should get a date with all journal entries being sorted.", async () => {
    const date = await getDate({
      date: new Date(),
      options: {
        sort: {
          by: "title",
          order: "desc",
        },
      },
    });

    expect(date).toBeDefined();

    data.journalEntries.reverse();

    expect(date.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    data.journalEntries.reverse();

    const date2 = await getDate({
      date: new Date(),
      options: {
        sort: {
          by: "title",
          order: "asc",
        },
      },
    });

    expect(date2).toBeDefined();

    expect(date2.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });
  });

  it("should get a date with journal entries being filtered.", async () => {
    const date = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: data.tags[0].name,
          materialType: MaterialType.Link,
          keyword: "Test Journal Entry 1",
        },
      },
    });

    expect(date).toBeDefined();

    expect(date.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[0].title,
          slug: data.journalEntries[0].slug,
          description: data.journalEntries[0].description,
          content: data.journalEntries[0].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[0].material.type,
            content: data.journalEntries[0].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date2 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: data.tags[1].name,
          materialType: MaterialType.Quote,
          keyword: "Test Journal Entry 2",
        },
      },
    });

    expect(date2).toBeDefined();

    expect(date2.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[1].title,
          slug: data.journalEntries[1].slug,
          description: data.journalEntries[1].description,
          content: data.journalEntries[1].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[1].material.type,
            content: data.journalEntries[1].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date3 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: data.tags[2].name,
          materialType: MaterialType.Image,
          keyword: "Test Journal Entry 3",
        },
      },
    });

    expect(date3).toBeDefined();

    expect(date3.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[2].title,
          slug: data.journalEntries[2].slug,
          description: data.journalEntries[2].description,
          content: data.journalEntries[2].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[2].material.type,
            content: data.journalEntries[2].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date4 = await getDate({
      date: new Date(),
      options: {
        filters: {
          keyword: "Test Journal Entry 4",
        },
      },
    });

    expect(date4).toBeDefined();

    expect(date4.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[3].title,
          slug: data.journalEntries[3].slug,
          description: data.journalEntries[3].description,
          content: data.journalEntries[3].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[3].material.type,
            content: data.journalEntries[3].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date5 = await getDate({
      date: new Date(),
      options: {
        filters: {
          keyword: "Test Journal Entry",
        },
      },
    });

    expect(date5).toBeDefined();

    expect(date5.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    const date6 = await getDate({
      date: new Date(),
      options: {
        filters: {
          keyword: "Test Journal Entry 1",
        },
      },
    });

    expect(date6).toBeDefined();

    expect(date6.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[0].title,
          slug: data.journalEntries[0].slug,
          description: data.journalEntries[0].description,
          content: data.journalEntries[0].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[0].material.type,
            content: data.journalEntries[0].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date7 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: data.tags[0].name,
        },
      },
    });

    expect(date7).toBeDefined();

    expect(date7.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    const date8 = await getDate({
      date: new Date(),
      options: {
        filters: {
          materialType: MaterialType.Link,
        },
      },
    });

    expect(date8).toBeDefined();

    expect(date8.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: data.journalEntries[0].title,
          slug: data.journalEntries[0].slug,
          description: data.journalEntries[0].description,
          content: data.journalEntries[0].content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: data.journalEntries[0].material.type,
            content: data.journalEntries[0].material.content,
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const result1 = await updateJournalEntry({
      id: date.payload?.journalEntries[0].id as string,
      title: "Test Journal Entry 1 Updated",
      slug: "test-journal-entry-1-updated",
      description: "Test Journal Entry 1 Description Updated",
      content: "Test Journal Entry 1 Content Updated",
      material: {
        id: date.payload?.journalEntries[0].material.id as string,
        type: MaterialType.Link,
        content: "https://www.google.com",
        createdAt: date.payload?.journalEntries[0].material.createdAt as Date,
      },
      tagIDs: data.tagIDs,
    });
    expect(result1).toBeDefined();
    expect(result1.errorMessage).toBeNull();

    const date9 = await getDate({
      date: new Date(),
      options: {
        filters: {
          keyword: "Updated",
        },
      },
    });

    expect(date9).toBeDefined();

    expect(date9.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Test Journal Entry 1 Updated",
          slug: "test-journal-entry-1-updated",
          description: "Test Journal Entry 1 Description Updated",
          content: "Test Journal Entry 1 Content Updated",
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: MaterialType.Link,
            content: "https://www.google.com",
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const newTags = await addTags([
      {
        name: "Test Tag 5",
        slug: "test-tag-5",
      },
      {
        name: "Test Tag 6",
        slug: "test-tag-6",
      },
    ]);

    if (newTags.errorMessage) {
      throw new Error(newTags.errorMessage);
    }

    const result2 = await updateJournalEntry({
      id: date.payload?.journalEntries[0].id as string,
      title: "Test Journal Entry 1",
      slug: "test-journal-entry-1",
      description: "Test Journal Entry 1 Description",
      content: "Test Journal Entry 1 Content",
      material: {
        id: date.payload?.journalEntries[0].material.id as string,
        type: MaterialType.Link,
        content: "https://www.google.com",
        createdAt: date.payload?.journalEntries[0].material.createdAt as Date,
      },
      tagIDs: [
        ...data.tagIDs.slice(0, 2),
        ...(newTags.payload?.map((tag) => tag.id) as string[]),
      ],
    });

    if (result2.errorMessage) {
      throw new Error(result2.errorMessage);
    }

    const date10 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: "Test Tag 5",
        },
      },
    });

    expect(date10).toBeDefined();

    expect(date10.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Test Journal Entry 1",
          slug: "test-journal-entry-1",
          description: "Test Journal Entry 1 Description",
          content: "Test Journal Entry 1 Content",
          tags: [
            ...data.tags.slice(0, 2).map((tag) => tag.name),
            "Test Tag 5",
            "Test Tag 6",
          ],
          material: {
            id: expect.any(String),
            type: MaterialType.Link,
            content: "https://www.google.com",
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date11 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: "Test Tag 6",
        },
      },
    });

    expect(date11).toBeDefined();

    expect(date11.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [
        {
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Test Journal Entry 1",
          slug: "test-journal-entry-1",
          description: "Test Journal Entry 1 Description",
          content: "Test Journal Entry 1 Content",
          tags: [
            ...data.tags.slice(0, 2).map((tag) => tag.name),
            "Test Tag 5",
            "Test Tag 6",
          ],
          material: {
            id: expect.any(String),
            type: MaterialType.Link,
            content: "https://www.google.com",
            createdAt: expect.any(Date),
          },
        },
      ],
    });

    const date12 = await getDate({
      date: new Date(),
      options: {
        filters: {
          tag: "Test Tag 4",
        },
      },
    });

    expect(date12).toBeDefined();

    expect(date12.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.slice(1).map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    const result3 = await updateJournalEntry({
      id: date.payload?.journalEntries[0].id as string,
      title: "Test Journal Entry 1",
      slug: "test-journal-entry-1",
      description: "Test Journal Entry 1 Description",
      content: "Test Journal Entry 1 Content",
      material: {
        id: date.payload?.journalEntries[0].material.id as string,
        type: MaterialType.Link,
        content: "https://www.google.com",
        createdAt: date.payload?.journalEntries[0].material.createdAt as Date,
      },
      tagIDs: data.tagIDs,
    });

    if (result3.errorMessage) {
      throw new Error(result3.errorMessage);
    }
  }, 120000);

  it("should get a date with journal entries with limit and offset.", async () => {
    const date = await getDate({
      date: new Date(),
      options: {
        limit: 2,
      },
    });

    expect(date).toBeDefined();

    expect(date.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.slice(0, 2).map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    const date2 = await getDate({
      date: new Date(),
      options: {
        limit: 2,
        offset: 2,
      },
    });

    expect(date2).toBeDefined();

    expect(date2.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.slice(2, 4).map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });

    const date3 = await getDate({
      date: new Date(),
      options: {
        limit: 2,
        offset: 4,
      },
    });

    expect(date3).toBeDefined();

    expect(date3.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: [],
    });

    const date4 = await getDate({
      date: new Date(),
      options: {
        limit: 2,
        offset: 1,
      },
    });

    expect(date4).toBeDefined();

    expect(date4.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(new Date()),
      journalEntries: data.journalEntries.slice(1, 3).map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: journalEntry.title,
        slug: journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: journalEntry.material.type,
          content: journalEntry.material.content,
          createdAt: expect.any(Date),
        },
      })),
    });
  }, 60000);

  it("should get all dates with empty journal entries. Default options (asc order)", async () => {
    const dates = await getDates({});

    expect(dates).toBeDefined();
    expect(dates.errorMessage).toBeNull();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);
  });

  it("should get all dates with empty journal entries. Sorted.", async () => {
    const dates = await getDates({
      options: {
        sort: {
          order: "desc",
        },
      },
    });

    expect(dates).toBeDefined();
    expect(dates.errorMessage).toBeNull();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
    ]);

    const dates2 = await getDates({
      options: {
        sort: {
          order: "asc",
        },
      },
    });

    expect(dates2).toBeDefined();

    expect(dates2.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);
  });

  it("should get dates with limit and offset", async () => {
    const dates = await getDates({
      options: {
        limit: 2,
        offset: 1,
      },
    });

    expect(dates).toBeDefined();
    expect(dates.errorMessage).toBeNull();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);

    const dates2 = await getDates({
      options: {
        limit: 2,
        offset: 2,
      },
    });

    expect(dates2).toBeDefined();
    expect(dates2.errorMessage).toBeNull();

    expect(dates2.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);

    const dates3 = await getDates({
      options: {
        limit: 2,
        offset: 3,
      },
    });

    expect(dates3).toBeDefined();
    expect(dates3.errorMessage).toBeNull();

    expect(dates3.payload).toEqual([]);
  });

  it("should get dates with journal entries. Default options (Ascending title. No filter.)", async () => {
    const addDateResults = await Promise.all(
      [data.yesterday, data.someRandomDay].map((date) =>
        createAndAddDate({ date })
      )
    );

    expect(addDateResults).toBeDefined();
    expect(addDateResults.every((result) => result.errorMessage === null));

    const dates = await getDates({
      options: {
        includeJournalEntries: true,
      },
    });

    expect(dates).toBeDefined();
    expect(dates.errorMessage).toBeNull();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);

    const dbYesterday = await getDate({ date: data.yesterday });

    if (dbYesterday.errorMessage) {
      throw new Error(dbYesterday.errorMessage);
    }

    await Promise.all(
      data.journalEntries.map((journalEntry) =>
        addJournalEntry({
          ...journalEntry,
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          tagIDs: data.tagIDs,
          date: { id: dbYesterday.payload?.id as string },
        })
      )
    );

    const dates2 = await getDates({
      options: {
        includeJournalEntries: true,
      },
    });

    expect(dates2).toBeDefined();

    expect(dates2.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);

    const addSomeRandomDayResult = await Promise.all(
      data.journalEntries.map((journalEntry) =>
        addJournalEntry({
          ...journalEntry,
          title: "Some Random Day: " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          tagIDs: data.tagIDs,
          date: { id: dates2.payload?.[0].id as string },
        })
      )
    );

    if (addSomeRandomDayResult.some((result) => result.errorMessage)) {
      throw new Error("Failed to add journal entries to some random day");
    }

    const dates3 = await getDates({
      options: {
        includeJournalEntries: true,
      },
    });

    expect(dates3).toBeDefined();

    expect(dates3.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day: " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);
  }, 120000);

  it("should get dates with journal entries being sorted.", async () => {
    const dates = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntrySort: {
          by: "title",
          order: "desc",
        },
      },
    });

    expect(dates).toBeDefined();

    data.journalEntries.reverse();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day: " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);

    const dates2 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntrySort: {
          by: "title",
          order: "asc",
        },
      },
    });

    expect(dates2).toBeDefined();

    data.journalEntries.reverse();

    expect(dates2.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day: " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);
  });

  it("should get dates with journal entries being filtered.", async () => {
    const dates = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          keyword: "Test Journal Entry 1",
        },
      },
    });

    expect(dates).toBeDefined();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[0].title,
            slug: "some-random-day-" + data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[0].material.type,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[0].title,
            slug: "yesterday-" + data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[0].material.type,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[0].title,
            slug: data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[0].material.type,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates2 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          keyword: "Test Journal Entry 2",
        },
      },
    });

    expect(dates2).toBeDefined();

    expect(dates2.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[1].title,
            slug: "some-random-day-" + data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[1].material.type,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[1].title,
            slug: "yesterday-" + data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[1].material.type,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[1].title,
            slug: data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: data.journalEntries[1].material.type,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates3 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          keyword: "Test Journal Entry",
        },
      },
    });

    expect(dates3).toBeDefined();

    expect(dates3.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day: " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday: " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: journalEntry.title,
          slug: journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: journalEntry.material.type,
            content: journalEntry.material.content,
            createdAt: expect.any(Date),
          },
        })),
      },
    ]);

    const dates4 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          materialType: MaterialType.Link,
        },
      },
    });

    expect(dates4).toBeDefined();

    expect(dates4.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[0].title,
            slug: "some-random-day-" + data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Link,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[0].title,
            slug: "yesterday-" + data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Link,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[0].title,
            slug: data.journalEntries[0].slug,
            description: data.journalEntries[0].description,
            content: data.journalEntries[0].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Link,
              content: data.journalEntries[0].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates5 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          materialType: MaterialType.Quote,
        },
      },
    });

    expect(dates5).toBeDefined();

    expect(dates5.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[1].title,
            slug: "some-random-day-" + data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Quote,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[1].title,
            slug: "yesterday-" + data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Quote,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[1].title,
            slug: data.journalEntries[1].slug,
            description: data.journalEntries[1].description,
            content: data.journalEntries[1].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Quote,
              content: data.journalEntries[1].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates6 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          materialType: MaterialType.Image,
        },
      },
    });

    expect(dates6).toBeDefined();

    expect(dates6.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[2].title,
            slug: "some-random-day-" + data.journalEntries[2].slug,
            description: data.journalEntries[2].description,
            content: data.journalEntries[2].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Image,
              content: data.journalEntries[2].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[2].title,
            slug: "yesterday-" + data.journalEntries[2].slug,
            description: data.journalEntries[2].description,
            content: data.journalEntries[2].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Image,
              content: data.journalEntries[2].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[2].title,
            slug: data.journalEntries[2].slug,
            description: data.journalEntries[2].description,
            content: data.journalEntries[2].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Image,
              content: data.journalEntries[2].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates7 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          materialType: MaterialType.Code,
        },
      },
    });

    expect(dates7).toBeDefined();

    expect(dates7.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Some Random Day: " + data.journalEntries[3].title,
            slug: "some-random-day-" + data.journalEntries[3].slug,
            description: data.journalEntries[3].description,
            content: data.journalEntries[3].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Code,
              content: data.journalEntries[3].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: "Yesterday: " + data.journalEntries[3].title,
            slug: "yesterday-" + data.journalEntries[3].slug,
            description: data.journalEntries[3].description,
            content: data.journalEntries[3].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Code,
              content: data.journalEntries[3].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [
          {
            id: expect.any(String),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            title: data.journalEntries[3].title,
            slug: data.journalEntries[3].slug,
            description: data.journalEntries[3].description,
            content: data.journalEntries[3].content,
            tags: data.tags.map((tag) => tag.name),
            material: {
              id: expect.any(String),
              type: MaterialType.Code,
              content: data.journalEntries[3].material.content,
              createdAt: expect.any(Date),
            },
          },
        ],
      },
    ]);

    const dates8 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          keyword: "nothing match",
        },
      },
    });

    expect(dates8).toBeDefined();

    expect(dates8.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);

    const dates9 = await getDates({
      options: {
        includeJournalEntries: true,
        journalEntryFilters: {
          keyword: "nothing match",
          materialType: MaterialType.Code,
        },
      },
    });

    expect(dates9).toBeDefined();

    expect(dates9.payload).toEqual([
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ]);
  }, 120000);

  it("should delete dates", async () => {
    const date = await deleteDate({ date: data.today });

    expect(date).toBeDefined();

    expect(date.errorMessage).toBeNull();
    expect(date.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.today),
      journalEntries: [],
    });

    const dbYesterday = await deleteDate({ date: data.yesterday });

    expect(dbYesterday).toBeDefined();

    expect(dbYesterday.errorMessage).toBeNull();
    expect(dbYesterday.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.yesterday),
      journalEntries: [],
    });

    const dbSomeRandomDay = await deleteDate({ date: data.someRandomDay });

    expect(dbSomeRandomDay).toBeDefined();

    expect(dbSomeRandomDay.errorMessage).toBeNull();
    expect(dbSomeRandomDay.payload).toEqual({
      id: expect.any(String),
      date: getStartOfDate(data.someRandomDay),
      journalEntries: [],
    });
  });
});
