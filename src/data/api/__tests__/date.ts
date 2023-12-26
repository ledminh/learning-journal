import { materialTypeMapFromDBServer } from "@/data/server/types/material";
import * as apiDate from "../date";
import * as apiJE from "../journal_entry";
import * as dbServer from "@/data/db_server";
import { getEndOfDate, getStartOfDate } from "@/utils/dateFunctions";

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
        type: dbServer.Types.MaterialType.Link,
        content: `{
            "title": "Test Journal Entry 1 Link",
            "url": "https://www.google.com",
            "description": "Test Journal Entry 1 Link Description",
            "imageUrl": "https://www.google.com"       
        }`,
      },
    },
    {
      title: "Test Journal Entry 2",
      slug: "test-journal-entry-2",
      description: "Test Journal Entry 2 Description",
      content: "Test Journal Entry 2 Content",
      material: {
        type: dbServer.Types.MaterialType.Quote,
        content: "Test Journal Entry 2 Quote",
      },
    },
    {
      title: "Test Journal Entry 3",
      slug: "test-journal-entry-3",
      description: "Test Journal Entry 3 Description",
      content: "Test Journal Entry 3 Content",
      material: {
        type: dbServer.Types.MaterialType.Image,
        content: "https://www.google.com",
      },
    },
    {
      title: "Test Journal Entry 4",
      slug: "test-journal-entry-4",
      description: "Test Journal Entry 4 Description",
      content: "Test Journal Entry 4 Content",
      material: {
        type: dbServer.Types.MaterialType.Code,
        content: "Test Journal Entry 4 Quote",
      },
    },
  ],
  today: new Date(),
  yesterday: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
  someRandomDay: new Date(2021, 1, 1),
};

const _before = async () => {
  const { errorMessage: errorMessageToday, payload: today } =
    await dbServer.DateEntry.createAndAddDate({});

  if (errorMessageToday) throw new Error(errorMessageToday);

  const { errorMessage: errorMessageYesterday, payload: yesterday } =
    await dbServer.DateEntry.createAndAddDate({
      date: data.yesterday,
    });

  if (errorMessageYesterday) throw new Error(errorMessageYesterday);

  const { errorMessage: errorMessageSomeRandomDay, payload: someRandomDay } =
    await dbServer.DateEntry.createAndAddDate({
      date: data.someRandomDay,
    });

  if (errorMessageSomeRandomDay) throw new Error(errorMessageSomeRandomDay);

  const { errorMessage: errorMessageTags, payload: tags } =
    await dbServer.Tag.addTags(data.tags);

  if (errorMessageTags) throw new Error(errorMessageTags);

  data.tagIDs = tags!.map((tag) => tag.id);

  const uploadJEResultsToday = await Promise.all(
    data.journalEntries.map((journalEntry) =>
      dbServer.JournalEntry.addJournalEntry({
        ...journalEntry,
        title: "Today " + journalEntry.title,
        slug: "today-" + journalEntry.slug,
        tagIDs: data.tagIDs,
        date: { id: today!.id },
      })
    )
  );

  const errorMessagesTD = uploadJEResultsToday
    .map((result) => result.errorMessage)
    .filter((errorMessage) => errorMessage !== null);

  if (errorMessagesTD.length > 0) {
    throw new Error(errorMessagesTD.join("\n"));
  }

  const uploadJEResultsYesterday = await Promise.all(
    data.journalEntries.map((journalEntry) =>
      dbServer.JournalEntry.addJournalEntry({
        ...journalEntry,
        title: "Yesterday " + journalEntry.title,
        slug: "yesterday-" + journalEntry.slug,
        tagIDs: data.tagIDs,
        date: { id: yesterday!.id },
      })
    )
  );

  const errorMessagesYD = uploadJEResultsYesterday
    .map((result) => result.errorMessage)
    .filter((errorMessage) => errorMessage !== null);

  if (errorMessagesYD.length > 0) {
    throw new Error(errorMessagesYD.join("\n"));
  }

  const uploadJEResultsSomeRandomDay = await Promise.all(
    data.journalEntries.map((journalEntry) =>
      dbServer.JournalEntry.addJournalEntry({
        ...journalEntry,
        title: "Some Random Day " + journalEntry.title,
        slug: "some-random-day-" + journalEntry.slug,
        tagIDs: data.tagIDs,
        date: { id: someRandomDay!.id },
      })
    )
  );

  const errorMessagesSRD = uploadJEResultsSomeRandomDay
    .map((result) => result.errorMessage)
    .filter((errorMessage) => errorMessage !== null);

  if (errorMessagesSRD.length > 0) {
    throw new Error(errorMessagesSRD.join("\n"));
  }
};

const _after = async () => {
  const { errorMessage: errorMessageJE, payload: journalEntries } =
    await apiJE.getJournalEntries({});

  if (errorMessageJE) {
    throw new Error(errorMessageJE);
  }

  const jEResults = await Promise.all(
    journalEntries!.map((je) => apiJE.deleteJournalEntry(je))
  );

  const errors = jEResults.filter((result) => result.errorMessage !== null);

  if (errors.length > 0) {
    throw new Error(errors[0].errorMessage!);
  }

  const { errorMessage: errorMessageTag, payload: tags } =
    await dbServer.Tag.getTags({});

  if (errorMessageTag) {
    throw new Error(errorMessageTag);
  }

  const tagResults = await Promise.all(
    tags!.map((tag) => dbServer.Tag.deleteTag(tag))
  );

  const tagErrors = tagResults.filter((result) => result.errorMessage !== null);

  if (tagErrors.length > 0) {
    throw new Error(tagErrors[0].errorMessage!);
  }

  const { errorMessage: errorMessageDate, payload: dates } =
    await dbServer.DateEntry.getDates({});

  if (errorMessageDate) {
    throw new Error(errorMessageDate);
  }

  const dateResults = await Promise.all(
    dates!.map((date) => dbServer.DateEntry.deleteDate(date))
  );

  const dateErrors = dateResults.filter(
    (result) => result.errorMessage !== null
  );

  if (dateErrors.length > 0) {
    throw new Error(dateErrors[0].errorMessage!);
  }
};

describe.skip("getDates", () => {
  beforeEach(_before, 40000);
  afterEach(_after, 40000);

  it.skip("should get dates with limit and offset (without JE)", async () => {
    const { errorMessage, payload } = await apiDate.getDates({
      limit: 1,
      offset: 0,
    });

    const expectedDates = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: [],
      },
    ];

    expect(errorMessage).toBeNull();

    expect(payload).toEqual(expectedDates);

    const { errorMessage: errorMessage2, payload: payload2 } =
      await apiDate.getDates({
        limit: 2,
        offset: 0,
      });

    const expectedDates2 = [
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
    ];

    expect(errorMessage2).toBeNull();

    expect(payload2).toEqual(expectedDates2);

    const { errorMessage: errorMessage3, payload: payload3 } =
      await apiDate.getDates({
        limit: 3,
        offset: 0,
      });

    const expectedDates3 = [
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
    ];

    expect(errorMessage3).toBeNull();

    expect(payload3).toEqual(expectedDates3);

    const { errorMessage: errorMessage4, payload: payload4 } =
      await apiDate.getDates({
        limit: 1,
        offset: 1,
      });

    const expectedDates4 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: [],
      },
    ];

    expect(errorMessage4).toBeNull();

    expect(payload4).toEqual(expectedDates4);

    const { errorMessage: errorMessage5, payload: payload5 } =
      await apiDate.getDates({
        limit: 1,
        offset: 2,
      });

    const expectedDates5 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: [],
      },
    ];

    expect(errorMessage5).toBeNull();

    expect(payload5).toEqual(expectedDates5);

    const { errorMessage: errorMessage6, payload: payload6 } =
      await apiDate.getDates({
        limit: 1,
        offset: 3,
      });

    const expectedDates6: any = [];

    expect(errorMessage6).toBeNull();

    expect(payload6).toEqual(expectedDates6);
  }, 400000);

  it.skip("should get dates with from and to (with JE)", async () => {
    const { errorMessage: errorMessage1, payload: payload1 } =
      await apiDate.getDates({
        from: getStartOfDate(data.today),
        to: getEndOfDate(data.today),
      });

    const expectedDates1 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Today " + journalEntry.title,
          slug: "today-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage1).toBeNull();

    expect(payload1).toEqual(expectedDates1);

    const { errorMessage: errorMessage2, payload: payload2 } =
      await apiDate.getDates({
        from: getStartOfDate(data.yesterday),
        to: getEndOfDate(data.yesterday),
      });

    const expectedDates2 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage2).toBeNull();

    expect(payload2).toEqual(expectedDates2);

    const { errorMessage: errorMessage3, payload: payload3 } =
      await apiDate.getDates({
        from: getStartOfDate(data.someRandomDay),
        to: getEndOfDate(data.someRandomDay),
      });

    const expectedDates3 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage3).toBeNull();

    expect(payload3).toEqual(expectedDates3);

    const { errorMessage: errorMessage4, payload: payload4 } =
      await apiDate.getDates({
        from: getStartOfDate(data.someRandomDay),
        to: getEndOfDate(data.yesterday),
      });

    const expectedDates4 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.yesterday),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Yesterday " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },

      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage4).toBeNull();

    expect(payload4).toEqual(expectedDates4);

    const { errorMessage: errorMessage5, payload: payload5 } =
      await apiDate.getDates({
        from: getStartOfDate(data.someRandomDay),
        to: getEndOfDate(data.today),
      });

    const expectedDates5 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Today " + journalEntry.title,
          slug: "today-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
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
          title: "Yesterday " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
      {
        id: expect.any(String),
        date: getStartOfDate(data.someRandomDay),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Some Random Day " + journalEntry.title,
          slug: "some-random-day-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage5).toBeNull();

    expect(payload5).toEqual(expectedDates5);

    const { errorMessage: errorMessage6, payload: payload6 } =
      await apiDate.getDates({
        from: getStartOfDate(data.yesterday),
        to: getEndOfDate(data.today),
      });

    const expectedDates6 = [
      {
        id: expect.any(String),
        date: getStartOfDate(data.today),
        journalEntries: data.journalEntries.map((journalEntry) => ({
          id: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: "Today " + journalEntry.title,
          slug: "today-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
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
          title: "Yesterday " + journalEntry.title,
          slug: "yesterday-" + journalEntry.slug,
          description: journalEntry.description,
          content: journalEntry.content,
          tags: data.tags.map((tag) => tag.name),
          material: {
            id: expect.any(String),
            type: materialTypeMapFromDBServer[journalEntry.material.type],
            content:
              journalEntry.material.type === dbServer.Types.MaterialType.Link
                ? JSON.parse(journalEntry.material.content)
                : journalEntry.material.content,
          },
        })),
      },
    ];

    expect(errorMessage6).toBeNull();

    expect(payload6).toEqual(expectedDates6);

    const { errorMessage: errorMessage7, payload: payload7 } =
      await apiDate.getDates({
        from: getStartOfDate(
          new Date(data.today.getTime() + 1000 * 60 * 60 * 24)
        ),
        to: getEndOfDate(new Date(data.today.getTime() + 1000 * 60 * 60 * 48)),
      });

    const expectedDates7: any = [];

    expect(errorMessage7).toBeNull();

    expect(payload7).toEqual(expectedDates7);

    const { errorMessage: errorMessage8, payload: payload8 } =
      await apiDate.getDates({
        from: getStartOfDate(
          new Date(data.yesterday.getTime() - 1000 * 60 * 60 * 48)
        ),
        to: getEndOfDate(
          new Date(data.yesterday.getTime() - 1000 * 60 * 60 * 24)
        ),
      });

    const expectedDates8: any = [];

    expect(errorMessage8).toBeNull();

    expect(payload8).toEqual(expectedDates8);
  }, 500000);
});

describe.skip("getDate", () => {
  beforeEach(_before, 40000);
  afterEach(_after, 40000);

  it("should get date with JE", async () => {
    const { errorMessage: errorMessage1, payload: payload1 } =
      await apiDate.getDate({
        date: getStartOfDate(data.today),
      });

    const expectedDate1 = {
      id: expect.any(String),
      date: getStartOfDate(data.today),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: "Today " + journalEntry.title,
        slug: "today-" + journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: materialTypeMapFromDBServer[journalEntry.material.type],
          content:
            journalEntry.material.type === dbServer.Types.MaterialType.Link
              ? JSON.parse(journalEntry.material.content)
              : journalEntry.material.content,
        },
      })),
    };

    expect(errorMessage1).toBeNull();

    expect(payload1).toEqual(expectedDate1);

    const { errorMessage: errorMessage2, payload: payload2 } =
      await apiDate.getDate({
        date: getStartOfDate(data.yesterday),
      });

    const expectedDate2 = {
      id: expect.any(String),
      date: getStartOfDate(data.yesterday),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: "Yesterday " + journalEntry.title,
        slug: "yesterday-" + journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: materialTypeMapFromDBServer[journalEntry.material.type],
          content:
            journalEntry.material.type === dbServer.Types.MaterialType.Link
              ? JSON.parse(journalEntry.material.content)
              : journalEntry.material.content,
        },
      })),
    };

    expect(errorMessage2).toBeNull();

    expect(payload2).toEqual(expectedDate2);

    const { errorMessage: errorMessage3, payload: payload3 } =
      await apiDate.getDate({
        date: getStartOfDate(data.someRandomDay),
      });

    const expectedDate3 = {
      id: expect.any(String),
      date: getStartOfDate(data.someRandomDay),
      journalEntries: data.journalEntries.map((journalEntry) => ({
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: "Some Random Day " + journalEntry.title,
        slug: "some-random-day-" + journalEntry.slug,
        description: journalEntry.description,
        content: journalEntry.content,
        tags: data.tags.map((tag) => tag.name),
        material: {
          id: expect.any(String),
          type: materialTypeMapFromDBServer[journalEntry.material.type],
          content:
            journalEntry.material.type === dbServer.Types.MaterialType.Link
              ? JSON.parse(journalEntry.material.content)
              : journalEntry.material.content,
        },
      })),
    };

    expect(errorMessage3).toBeNull();

    expect(payload3).toEqual(expectedDate3);

    const { errorMessage: errorMessage4, payload: payload4 } =
      await apiDate.getDate({
        date: getStartOfDate(
          new Date(data.today.getTime() + 1000 * 60 * 60 * 24)
        ),
      });

    expect(errorMessage4).toBe(null);
    expect(payload4).toBe(null);
  }, 500000);
});
