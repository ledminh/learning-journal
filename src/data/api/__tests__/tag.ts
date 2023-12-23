import * as apiJE from "../journal_entry";
import * as apiTag from "../tag";

import * as dbTag from "@/data/db_server/tag";
import * as dbDate from "@/data/db_server/date";

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
  const { errorMessage } = await apiTag.addTags({
    names: [
      "test tag 1",
      "test tag 2",
      "test tag 3",
      "test tag 4",
      "test tag 5",
      "test tag 6",
      "test tag 7",
      "test tag 8",
      "test tag 9",
    ],
  });

  if (errorMessage) {
    throw new Error(errorMessage);
  }
};

describe.skip("API/Get Tags", () => {
  beforeEach(_before, 40000);
  afterEach(_after, 40000);

  it("should get all tags with no JE", async () => {
    const { errorMessage, payload: tags } = await apiTag.getTags({});

    const expectedTags = [
      {
        id: expect.any(String),
        name: "test tag 1",
        slug: "test-tag-1",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 2",
        slug: "test-tag-2",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 3",
        slug: "test-tag-3",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 4",
        slug: "test-tag-4",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 5",
        slug: "test-tag-5",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 6",
        slug: "test-tag-6",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 7",
        slug: "test-tag-7",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 8",
        slug: "test-tag-8",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 9",
        slug: "test-tag-9",
        journalEntries: [],
      },
    ];

    expect(errorMessage).toBeNull();

    expect(tags).toEqual(expectedTags);
  });

  it("should get a limited number of tags with no JE", async () => {
    const { errorMessage, payload: tags } = await apiTag.getTags({
      limit: 5,
    });

    const expectedTags = [
      {
        id: expect.any(String),
        name: "test tag 1",
        slug: "test-tag-1",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 2",
        slug: "test-tag-2",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 3",
        slug: "test-tag-3",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 4",
        slug: "test-tag-4",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 5",
        slug: "test-tag-5",
        journalEntries: [],
      },
    ];

    expect(errorMessage).toBeNull();

    expect(tags).toEqual(expectedTags);

    const { errorMessage: errorMessage2, payload: tags2 } =
      await apiTag.getTags({
        limit: 8,
      });

    const expectedTags2 = [
      {
        id: expect.any(String),
        name: "test tag 1",
        slug: "test-tag-1",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 2",
        slug: "test-tag-2",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 3",
        slug: "test-tag-3",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 4",
        slug: "test-tag-4",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 5",
        slug: "test-tag-5",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 6",
        slug: "test-tag-6",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 7",
        slug: "test-tag-7",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 8",
        slug: "test-tag-8",
        journalEntries: [],
      },
    ];

    expect(errorMessage2).toBeNull();

    expect(tags2).toEqual(expectedTags2);

    const { errorMessage: errorMessage3, payload: tags3 } =
      await apiTag.getTags({
        limit: 10,
      });

    const expectedTags3 = [
      {
        id: expect.any(String),
        name: "test tag 1",
        slug: "test-tag-1",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 2",
        slug: "test-tag-2",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 3",
        slug: "test-tag-3",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 4",
        slug: "test-tag-4",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 5",
        slug: "test-tag-5",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 6",
        slug: "test-tag-6",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 7",
        slug: "test-tag-7",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 8",
        slug: "test-tag-8",
        journalEntries: [],
      },
      {
        id: expect.any(String),
        name: "test tag 9",
        slug: "test-tag-9",
        journalEntries: [],
      },
    ];

    expect(errorMessage3).toBeNull();

    expect(tags3).toEqual(expectedTags3);
  });
});
