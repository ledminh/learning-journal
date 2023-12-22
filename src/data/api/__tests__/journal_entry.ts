import {
  DataToCreateJournalEntry,
  JournalEntry,
} from "@/data/server/types/journal_entry";

import * as apiJE from "../journal_entry";
import * as dbTag from "@/data/db_server/tag";
import * as dbDate from "@/data/db_server/date";

import { MaterialType } from "@/data/server/types/material";

describe("API/Add Journal Entry", () => {
  afterEach(async () => {
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
      await dbTag.getTags({});

    if (errorMessageTag) {
      throw new Error(errorMessageTag);
    }

    const tagResults = await Promise.all(
      tags!.map((tag) => dbTag.deleteTag(tag))
    );

    const tagErrors = tagResults.filter(
      (result) => result.errorMessage !== null
    );

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
  });

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

    console.log(result);
    expect(errorMessage).toBeNull();
    expect(result).toEqual(expected);
  }, 40000);
});
