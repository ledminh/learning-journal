import {
  DataToCreateJournalEntry,
  JournalEntry,
} from "@/data/server/types/journal_entry";

import * as apiJE from "../journal_entry";
import * as apiTag from "../tag";

import * as dbTag from "@/data/db_server/tag";
import * as dbDate from "@/data/db_server/date";

import { MaterialType } from "@/data/server/types/material";

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

  const { errorMessage: errorMessageTag, payload: tags } = await dbTag.getTags(
    {}
  );

  if (errorMessageTag) {
    throw new Error(errorMessageTag);
  }

  const tagResults = await Promise.all(
    tags!.map((tag) => dbTag.deleteTag(tag))
  );

  const tagErrors = tagResults.filter((result) => result.errorMessage !== null);

  if (tagErrors.length > 0) {
    throw new Error(tagErrors[0].errorMessage!);
  }

  const { errorMessage: errorMessageDate, payload: dates } =
    await dbDate.getDates({});

  if (errorMessageDate) {
    throw new Error(errorMessageDate);
  }

  const dateResults = await Promise.all(
    dates!.map((date) => dbDate.deleteDate(date))
  );

  const dateErrors = dateResults.filter(
    (result) => result.errorMessage !== null
  );

  if (dateErrors.length > 0) {
    throw new Error(dateErrors[0].errorMessage!);
  }
};

const _before = async () => {
  const { errorMessage: errorMessageTag, payload: tags } = await apiTag.addTags(
    {
      names: ["test tag 1", "test tag 2", "test tag 3"],
    }
  );

  if (errorMessageTag) {
    throw new Error(errorMessageTag);
  }

  const _data: DataToCreateJournalEntry[] = Array.from(
    { length: 10 },
    (_, index) => ({
      title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
      tags: tags!.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      description: `Test Description ${index + 1}`,
      material: {
        type: MaterialType.QUOTE,
        content: `Test Material Content ${index + 1}`,
      },

      content: `Test Content ${index + 1}`,
    })
  );

  const data: DataToCreateJournalEntry[] = [
    {
      title: "Z. first Journal Entry",
      tags: tags!.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      description: "Z. first Description",
      material: {
        type: MaterialType.QUOTE,
        content: "Z. first Material Content",
      },

      content: "Z. first Content",
    },
    ..._data,
    {
      title: "A. last Journal Entry",
      tags: tags!.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      description: "A. last Description",
      material: {
        type: MaterialType.QUOTE,
        content: "A. last Material Content",
      },

      content: "A. last Content",
    },
  ];

  let results: {
    errorMessage: string | null;
    payload: JournalEntry | null;
  }[] = [];

  for (let i = 0; i < data.length; i++) {
    const result = await apiJE.addJournalEntry(data[i]);
    results.push(result);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const errors = results.filter((result) => result.errorMessage !== null);

  if (errors.length > 0) {
    throw new Error(errors[0].errorMessage!);
  }
};

describe.skip("API/Get Journal Entries", () => {
  beforeAll(_before, 200000);

  afterAll(_after, 40000);

  it.skip("should get all journal entries", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({});

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
        slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${index + 1}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${index + 1}`,
        content: `Test Content ${index + 1}`,
      })
    );

    const expected = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries with limit", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      limit: 5,
    });

    const _expected: JournalEntry[] = Array.from({ length: 4 }, (_, index) => ({
      id: expect.any(String),
      title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
      slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: `Test Material Content ${index + 1}`,
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: `Test Description ${index + 1}`,
      content: `Test Content ${index + 1}`,
    }));

    const expected = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries with offset", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      offset: 5,
    });

    const _expected: JournalEntry[] = Array.from({ length: 6 }, (_, index) => ({
      id: expect.any(String),
      title: `Test Journal Entry ${index + 5 < 10 ? "0" : ""}${index + 5}`,
      slug: `test-journal-entry-${index + 5 < 10 ? "0" : ""}${index + 5}`,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: `Test Material Content ${index + 5}`,
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: `Test Description ${index + 5}`,
      content: `Test Content ${index + 5}`,
    }));

    const expected: JournalEntry[] = [
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries with filter by materialType", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      filters: {
        materialType: MaterialType.QUOTE,
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
        slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${index + 1}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${index + 1}`,
        content: `Test Content ${index + 1}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);

    const { errorMessage: errorMessageJEC, payload: resultJEC } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.CODE,
        },
      });

    expect(errorMessageJEC).toBeNull();
    expect(resultJEC).toEqual([]);

    const { errorMessage: errorMessageJEL, payload: resultJEL } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.LINK,
        },
      });

    expect(errorMessageJEL).toBeNull();

    expect(resultJEL).toEqual([]);

    const { errorMessage: errorMessageJEI, payload: resultJEI } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.IMAGE,
        },
      });

    expect(errorMessageJEI).toBeNull();

    expect(resultJEI).toEqual([]);

    const { errorMessage: errorMessageTag, payload: tags } =
      await apiTag.getTags({});

    if (errorMessageTag) {
      throw new Error(errorMessageTag);
    }

    const { errorMessage: errorMessageAJEC, payload: resultAJEC } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry Code",
        tags: [
          {
            name: null,
            id: tags![0].id,
          },
          {
            name: null,
            id: tags![1].id,
          },
          {
            name: null,
            id: tags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.CODE,
          content: "Test Material Content",
        },

        content: "Test Content",
      });

    if (errorMessageAJEC) {
      throw new Error(errorMessageAJEC);
    }

    const { errorMessage: errorMessageAJEL, payload: resultAJEL } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry Link",
        tags: [
          {
            name: null,
            id: tags![0].id,
          },
          {
            name: null,
            id: tags![1].id,
          },
          {
            name: null,
            id: tags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.LINK,
          content: {
            title: "Test Link Title",
            url: "https://test-link-url.com",
            description: "Test Link Description",
            imageUrl: "https://test-link-image-url.com",
          },
        },

        content: "Test Content",
      });

    if (errorMessageAJEL) {
      throw new Error(errorMessageAJEL);
    }

    const { errorMessage: errorMessageAJEI, payload: resultAJEI } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry Image",
        tags: [
          {
            name: null,
            id: tags![0].id,
          },
          {
            name: null,
            id: tags![1].id,
          },
          {
            name: null,
            id: tags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.IMAGE,
          content: new File(["test"], "test.jpg", { type: "image/jpeg" }),
        },

        content: "Test Content",
      });

    if (errorMessageAJEI) {
      throw new Error(errorMessageAJEI);
    }

    const { errorMessage: errorMessageJEC2, payload: resultJEC2 } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.CODE,
        },
      });

    expect(errorMessageJEC2).toBeNull();

    expect(resultJEC2).toEqual([
      {
        id: expect.any(String),
        title: "Test Journal Entry Code",
        slug: "test-journal-entry-code",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "Test Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Test Description",
        content: "Test Content",
      },
    ]);

    const { errorMessage: errorMessageJEL2, payload: resultJEL2 } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.LINK,
        },
      });

    expect(errorMessageJEL2).toBeNull();

    expect(resultJEL2).toEqual([
      {
        id: expect.any(String),
        title: "Test Journal Entry Link",
        slug: "test-journal-entry-link",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            title: "Test Link Title",
            url: "https://test-link-url.com",
            description: "Test Link Description",
            imageUrl: "https://test-link-image-url.com",
          },
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Test Description",
        content: "Test Content",
      },
    ]);

    const { errorMessage: errorMessageJEI2, payload: resultJEI2 } =
      await apiJE.getJournalEntries({
        filters: {
          materialType: MaterialType.IMAGE,
        },
      });

    expect(errorMessageJEI2).toBeNull();

    expect(resultJEI2).toEqual([
      {
        id: expect.any(String),
        title: "Test Journal Entry Image",
        slug: "test-journal-entry-image",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Test Description",
        content: "Test Content",
      },
    ]);
  }, 400000);

  it.skip("should get all journal entries with filter by keyword", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      filters: {
        keyword: "Journal Entry",
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
        slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${index + 1}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${index + 1}`,
        content: `Test Content ${index + 1}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);

    const { errorMessage: errorMessage2, payload: result2 } =
      await apiJE.getJournalEntries({
        filters: {
          keyword: "Test Journal Entry",
        },
      });

    expect(errorMessage2).toBeNull();

    expect(result2).toEqual(_expected);

    const { errorMessage: errorMessage3, payload: result3 } =
      await apiJE.getJournalEntries({
        filters: {
          keyword: "01",
        },
      });

    expect(errorMessage3).toBeNull();

    expect(result3).toEqual([
      {
        id: expect.any(String),
        title: "Test Journal Entry 01",
        slug: "test-journal-entry-01",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Test Material Content 1",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Test Description 1",
        content: "Test Content 1",
      },
    ]);

    const { errorMessage: errorMessage4, payload: result4 } =
      await apiJE.getJournalEntries({
        filters: {
          keyword: "A. last",
        },
      });

    expect(errorMessage4).toBeNull();

    expect(result4).toEqual([
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
    ]);

    const { errorMessage: errorMessage5, payload: result5 } =
      await apiJE.getJournalEntries({
        filters: {
          keyword: "Z. first",
        },
      });

    expect(errorMessage5).toBeNull();

    expect(result5).toEqual([
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ]);

    const { errorMessage: errorMessage6, payload: result6 } =
      await apiJE.getJournalEntries({
        filters: {
          keyword: "02",
        },
      });

    expect(errorMessage6).toBeNull();

    expect(result6).toEqual([
      {
        id: expect.any(String),
        title: "Test Journal Entry 02",
        slug: "test-journal-entry-02",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Test Material Content 2",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Test Description 2",
        content: "Test Content 2",
      },
    ]);
  }, 400000);

  it.skip("should get all journal entries sorted by date ascending", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      sort: {
        by: "date",
        order: "asc",
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
        slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${index + 1}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${index + 1}`,
        content: `Test Content ${index + 1}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries sorted by date descending", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      sort: {
        by: "date",
        order: "desc",
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${10 - index < 10 ? "0" : ""}${10 - index}`,
        slug: `test-journal-entry-${10 - index < 10 ? "0" : ""}${10 - index}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${10 - index}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${10 - index}`,
        content: `Test Content ${10 - index}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries sorted by title ascending", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      sort: {
        by: "title",
        order: "asc",
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${index + 1 < 10 ? "0" : ""}${index + 1}`,
        slug: `test-journal-entry-${index + 1 < 10 ? "0" : ""}${index + 1}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${index + 1}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${index + 1}`,
        content: `Test Content ${index + 1}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it.skip("should get all journal entries sorted by title descending", async () => {
    const { errorMessage, payload: result } = await apiJE.getJournalEntries({
      sort: {
        by: "title",
        order: "desc",
      },
    });

    const _expected: JournalEntry[] = Array.from(
      { length: 10 },
      (_, index) => ({
        id: expect.any(String),
        title: `Test Journal Entry ${10 - index < 10 ? "0" : ""}${10 - index}`,
        slug: `test-journal-entry-${10 - index < 10 ? "0" : ""}${10 - index}`,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: `Test Material Content ${10 - index}`,
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: `Test Description ${10 - index}`,
        content: `Test Content ${10 - index}`,
      })
    );

    const expected: JournalEntry[] = [
      {
        id: expect.any(String),
        title: "Z. first Journal Entry",
        slug: "z-first-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "Z. first Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "Z. first Description",
        content: "Z. first Content",
      },
      ..._expected,
      {
        id: expect.any(String),
        title: "A. last Journal Entry",
        slug: "a-last-journal-entry",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "A. last Material Content",
        },
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        description: "A. last Description",
        content: "A. last Content",
      },
    ];

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);
});

describe.skip("API/Get Journal Entry", () => {
  afterEach(_after, 40000);

  it("should get a QUOTE journal entry", async () => {
    const { errorMessage: errorMessageTag, payload: tags } =
      await apiTag.addTags({
        names: ["test tag 1", "test tag 2", "test tag 3"],
      });

    if (errorMessageTag) {
      throw new Error(errorMessageTag);
    }

    const { errorMessage: errorMessageJE, payload: journalEntry } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry",
        tags: [
          {
            name: null,
            id: tags![0].id,
          },
          {
            name: null,
            id: tags![1].id,
          },
          {
            name: null,
            id: tags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.QUOTE,
          content: "Test Material Content",
        },

        content: "Test Content",
      });

    if (errorMessageJE) {
      throw new Error(errorMessageJE);
    }

    const { errorMessage, payload: result } = await apiJE.getJournalEntry({
      slug: journalEntry!.slug,
    });

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);

  it("should get a CODE journal entry", async () => {
    const { errorMessage: errorMessageTag, payload: tags } =
      await apiTag.addTags({
        names: ["test tag 1", "test tag 2", "test tag 3"],
      });

    if (errorMessageTag) {
      throw new Error(errorMessageTag);
    }

    const { errorMessage: errorMessageJE, payload: journalEntry } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry",
        tags: [
          {
            name: null,
            id: tags![0].id,
          },
          {
            name: null,
            id: tags![1].id,
          },
          {
            name: null,
            id: tags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.CODE,
          content: "Test Material Content",
        },

        content: "Test Content",
      });

    if (errorMessageJE) {
      throw new Error(errorMessageJE);
    }

    const { errorMessage, payload: result } = await apiJE.getJournalEntry({
      slug: journalEntry!.slug,
    });

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.CODE,
        content: "Test Material Content",
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  });

  it("should get a LINK journal entry", async () => {
    const { errorMessage: errorMessageJE, payload: journalEntry } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry",
        tags: [
          {
            name: "test tag 1",
            id: null,
          },
          {
            name: "test tag 2",
            id: null,
          },
          {
            name: "test tag 3",
            id: null,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.LINK,
          content: {
            title: "Test Link Title",
            url: "https://test-link-url.com",
            description: "Test Link Description",
            imageUrl: "https://test-link-image-url.com",
          },
        },

        content: "Test Content",
      });

    if (errorMessageJE) {
      throw new Error(errorMessageJE);
    }

    const { errorMessage, payload: result } = await apiJE.getJournalEntry({
      slug: journalEntry!.slug,
    });

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.LINK,
        content: {
          title: "Test Link Title",
          url: "https://test-link-url.com",
          description: "Test Link Description",
          imageUrl: "https://test-link-image-url.com",
        },
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  });

  it("should get an IMAGE journal entry", async () => {
    const { errorMessage: errorMessageOT, payload: oldTags } =
      await apiTag.addTags({
        names: ["old tag 1", "old tag 2", "old-tag-3", "old-tag-4"],
      });

    if (errorMessageOT) {
      throw new Error(errorMessageOT);
    }

    const { errorMessage: errorMessageJE, payload: journalEntry } =
      await apiJE.addJournalEntry({
        title: "Test Journal Entry",
        tags: [
          {
            name: "test tag 1",
            id: null,
          },
          {
            name: "test tag 2",
            id: null,
          },
          {
            name: "test tag 3",
            id: null,
          },
          {
            name: null,
            id: oldTags![0].id,
          },
          {
            name: null,
            id: oldTags![1].id,
          },
          {
            name: null,
            id: oldTags![2].id,
          },
        ],

        description: "Test Description",
        material: {
          type: MaterialType.IMAGE,
          content: new File(["test image content"], "test-image.png"),
        },

        content: "Test Content",
      });

    if (errorMessageJE) {
      throw new Error(errorMessageJE);
    }

    const { errorMessage, payload: result } = await apiJE.getJournalEntry({
      slug: journalEntry!.slug,
    });

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.IMAGE,
        content: expect.any(String),
      },
      tags: [
        "old tag 1",
        "old tag 2",
        "old-tag-3",
        "test tag 1",
        "test tag 2",
        "test tag 3",
      ],
      description: "Test Description",
      content: "Test Content",
    };

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  }, 40000);
});

describe.skip("API/Add Journal Entry", () => {
  afterEach(_after, 40000);

  it("should add a journal entry with Quote material with all new tags", async () => {
    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: "test tag 1",
          id: null,
        },
        {
          name: "test tag 2",
          id: null,
        },
        {
          name: "test tag 3",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  });

  it("should add a journal entry with Code material with all new tags", async () => {
    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: "test tag 1",
          id: null,
        },
        {
          name: "test tag 2",
          id: null,
        },
        {
          name: "test tag 3",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.CODE,
        content: "Test Material Content",
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.CODE,
        content: "Test Material Content",
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  });

  it("should add a journal entry with Link material with all new tags", async () => {
    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: "test tag 1",
          id: null,
        },
        {
          name: "test tag 2",
          id: null,
        },
        {
          name: "test tag 3",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.LINK,
        content: {
          title: "Test Link Title",
          url: "https://test-link-url.com",
          description: "Test Link Description",
          imageUrl: "https://test-link-image-url.com",
        },
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.LINK,
        content: {
          title: "Test Link Title",
          url: "https://test-link-url.com",
          description: "Test Link Description",
          imageUrl: "https://test-link-image-url.com",
        },
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  });

  it("should add a journal entry with Image material with all new tags", async () => {
    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: "test tag 1",
          id: null,
        },
        {
          name: "test tag 2",
          id: null,
        },
        {
          name: "test tag 3",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.IMAGE,
        content: new File(["test image content"], "test-image.png"),
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.IMAGE,
        content: expect.any(String),
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  }, 40000);

  it("should add a journal entry with Quote material with all existing tags", async () => {
    const { errorMessage: errorMessageTag, payload: tags } =
      await apiTag.addTags({
        names: ["test tag 1", "test tag 2", "test tag 3"],
      });

    if (errorMessageTag) {
      throw new Error(errorMessageTag);
    }

    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: null,
          id: tags![0].id,
        },
        {
          name: null,
          id: tags![1].id,
        },
        {
          name: null,
          id: tags![2].id,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },
      tags: ["test tag 1", "test tag 2", "test tag 3"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  });

  it("should add a journal entry with Quote material with some new tags and some existing tags", async () => {
    const { errorMessage: errorMessageOT, payload: oldTags } =
      await apiTag.addTags({
        names: ["old-tag-1", "old-tag-2", "old-tag-3", "old-tag-4"],
      });

    if (errorMessageOT) {
      throw new Error(errorMessageOT);
    }

    const data: DataToCreateJournalEntry = {
      title: "Test Journal Entry",
      tags: [
        {
          name: null,
          id: oldTags![0].id,
        },
        {
          name: null,
          id: oldTags![1].id,
        },
        {
          name: "test tag 3",
          id: null,
        },
        {
          name: "test tag 4",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },

      content: "Test Content",
    };

    const expected: JournalEntry = {
      id: expect.any(String),
      title: "Test Journal Entry",
      slug: "test-journal-entry",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      material: {
        id: expect.any(String),
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },
      tags: ["old-tag-1", "old-tag-2", "test tag 3", "test tag 4"],
      description: "Test Description",
      content: "Test Content",
    };

    const { errorMessage, payload: result } = await apiJE.addJournalEntry(data);

    expect(errorMessage).toBeNull();

    expect(result).toEqual(expected);
  });
});

describe("API/Update Journal Entry", () => {
  beforeEach(async () => {
    const { errorMessage } = await apiJE.addJournalEntry({
      title: "Test Journal Entry",
      tags: [
        {
          name: "test tag 1",
          id: null,
        },
        {
          name: "test tag 2",
          id: null,
        },
        {
          name: "test tag 3",
          id: null,
        },
      ],

      description: "Test Description",
      material: {
        type: MaterialType.QUOTE,
        content: "Test Material Content",
      },

      content: "Test Content",
    });
  }, 400000);
  afterEach(_after, 400000);

  // Change texts

  it.skip("should update journal entry's title", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags,
        title: "Updated Journal Entry Title",
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      title: "Updated Journal Entry Title",
      slug: "updated-journal-entry-title",
      updatedAt: expect.any(Date),
    });
  }, 400000);

  it.skip("should update journal entry's description", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags,
        description: "Updated Journal Entry Description",
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      description: "Updated Journal Entry Description",
      updatedAt: expect.any(Date),
    });
  }, 400000);

  it.skip("should update journal entry's content", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags,
        content: "Updated Journal Entry Content",
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      content: "Updated Journal Entry Content",
      updatedAt: expect.any(Date),
    });
  }, 400000);

  // Change tags

  it("should add more tags to journal entry", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags: [
          ...tags,
          {
            name: "test tag 4",
            id: null,
          },
          {
            name: "test tag 5",
            id: null,
          },
        ],
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      tags: [
        "test tag 1",
        "test tag 2",
        "test tag 3",
        "test tag 4",
        "test tag 5",
      ],
      updatedAt: expect.any(Date),
    });
  }, 400000);

  it("should delete some tags from journal entry", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags: tags.slice(0, 1),
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      tags: ["test tag 1"],
      updatedAt: expect.any(Date),
    });
  }, 400000);

  it("should change to another set of tags", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags: [
          {
            name: "test tag 4",
            id: null,
          },
          {
            name: "test tag 5",
            id: null,
          },
        ],
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      tags: ["test tag 4", "test tag 5"],
      updatedAt: expect.any(Date),
    });
  }, 400000);

  it("should change to another set of tags with some existing tags and some new tags", async () => {
    const { errorMessage: errorMessageOJE, payload: oldJE } =
      await apiJE.getJournalEntry({
        slug: "test-journal-entry",
      });

    if (errorMessageOJE) {
      throw new Error(errorMessageOJE);
    }

    const { errorMessage: errorMessageT, payload: _tags } =
      await apiTag.getTags({});

    if (errorMessageT) {
      throw new Error(errorMessageT);
    }

    const tags = _tags!
      .filter((tag) => oldJE!.tags.slice(0, 1).includes(tag.name))
      .map((tag) => ({
        name: null,
        id: tag.id,
      }));

    const { errorMessage: errorMessageUJE, payload: updatedJE } =
      await apiJE.updateJournalEntry({
        ...oldJE!,
        tags: [
          ...tags,
          {
            name: "test tag 4",
            id: null,
          },
          {
            name: "test tag 5",
            id: null,
          },
        ],
        material: {
          id: oldJE!.material.id,
        },
      });

    expect(errorMessageUJE).toBeNull();

    expect(updatedJE).toEqual({
      ...oldJE!,
      tags: ["test tag 1", "test tag 4", "test tag 5"],
      updatedAt: expect.any(Date),
    });
  }, 400000);
});
