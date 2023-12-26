import * as apiJE from "../journal_entry";
import * as apiTag from "../tag";

import * as dbTag from "@/data/db_server/tag";
import * as dbDate from "@/data/db_server/date";
import { MaterialType } from "@/data/server/types/material";
import exp from "constants";

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

describe.skip("API/Get Tag", () => {
  beforeEach(async () => {
    // Add first JE
    const { errorMessage } = await apiJE.addJournalEntry({
      title: "Z. First JE",
      description: "Z. First JE",
      content: "z first JE",
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
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 1",
      },
    });

    if (errorMessage) {
      throw new Error(errorMessage);
    }

    // Prepare tags
    const { errorMessage: errorMessage2 } = await apiTag.addTags({
      names: ["test tag 4", "test tag 5", "test tag 6"],
    });

    if (errorMessage2) {
      throw new Error(errorMessage2);
    }

    const { errorMessage: errorMessage3, payload: allTags } =
      await apiTag.getTags({});

    if (errorMessage3) {
      throw new Error(errorMessage3);
    }

    const jeTags = allTags!.slice(0, 3);

    // Add CODE JE

    const { errorMessage: errorMessage4 } = await apiJE.addJournalEntry({
      title: "Code JE",
      description: "Code JE",
      content: "code JE",
      tags: jeTags.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      material: {
        type: MaterialType.CODE,
        content: "some code here",
      },
    });

    if (errorMessage4) {
      throw new Error(errorMessage4);
    }

    // Add LINK JE
    const { errorMessage: errorMessage5 } = await apiJE.addJournalEntry({
      title: "Link JE",
      description: "Link JE",
      content: "link JE",
      tags: jeTags.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      material: {
        type: MaterialType.LINK,
        content: {
          url: "https://www.google.com",
          title: "Google",
          description: "Google",
          imageUrl:
            "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
        },
      },
    });

    if (errorMessage5) {
      throw new Error(errorMessage5);
    }

    // Add last JE
    const { errorMessage: errorMessageLast } = await apiJE.addJournalEntry({
      title: "A. Last JE - Image",
      description: "A. Last JE - Image",
      content: "a last JE - image",
      tags: jeTags.map((tag) => ({
        name: null,
        id: tag.id,
      })),
      material: {
        type: MaterialType.IMAGE,
        content: new File([""], "test.jpg", { type: "image/jpeg" }),
      },
    });

    if (errorMessageLast) {
      throw new Error(errorMessageLast);
    }
  }, 40000);

  afterEach(_after, 40000);

  it.skip("should get a tag with no JE", async () => {
    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-4",
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 4",
      slug: "test-tag-4",
      journalEntries: [],
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-5",
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 5",
      slug: "test-tag-5",
      journalEntries: [],
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-6",
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 6",
      slug: "test-tag-6",
      journalEntries: [],
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);
  });

  it.skip("should get a tag with JE, default options", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const _expectedTag = {
      id: expect.any(String),
      journalEntries,
    };

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
    });

    const expectedTag = {
      ..._expectedTag,
      name: "test tag 1",
      slug: "test-tag-1",
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
    });

    const expectedTag2 = {
      ..._expectedTag,
      name: "test tag 2",
      slug: "test-tag-2",
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
    });

    const expectedTag3 = {
      ..._expectedTag,
      name: "test tag 3",
      slug: "test-tag-3",
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);
  });

  it.skip("should get a tag with limited JE", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      limit: 1,
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: journalEntries.slice(0, 1),
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
      limit: 2,
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 2",
      slug: "test-tag-2",
      journalEntries: journalEntries.slice(0, 2),
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
      limit: 3,
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: journalEntries.slice(0, 3),
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);

    const { errorMessage: errorMessage4, payload: tag4 } = await apiTag.getTag({
      slug: "test-tag-3",
      limit: 4,
    });

    const expectedTag4 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: journalEntries,
    };

    expect(errorMessage4).toBeNull();

    expect(tag4).toEqual(expectedTag4);

    const { errorMessage: errorMessage5, payload: tag5 } = await apiTag.getTag({
      slug: "test-tag-3",
      limit: 5,
    });

    const expectedTag5 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: journalEntries,
    };

    expect(errorMessage5).toBeNull();

    expect(tag5).toEqual(expectedTag5);
  });

  it.skip("should get a tag with offset JE", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      offset: 1,
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: journalEntries.slice(1),
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
      offset: 2,
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 2",
      slug: "test-tag-2",
      journalEntries: journalEntries.slice(2),
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
      offset: 3,
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: journalEntries.slice(3),
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);

    const { errorMessage: errorMessage4, payload: tag4 } = await apiTag.getTag({
      slug: "test-tag-3",
      offset: 4,
    });

    const expectedTag4 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [],
    };

    expect(errorMessage4).toBeNull();

    expect(tag4).toEqual(expectedTag4);

    const { errorMessage: errorMessage5, payload: tag5 } = await apiTag.getTag({
      slug: "test-tag-3",
      offset: 5,
    });

    const expectedTag5 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [],
    };

    expect(errorMessage5).toBeNull();

    expect(tag5).toEqual(expectedTag5);
  });

  it.skip("should get a tag with limit and offset JE", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      limit: 1,
      offset: 1,
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: journalEntries.slice(1, 2),
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
      limit: 2,
      offset: 2,
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 2",
      slug: "test-tag-2",
      journalEntries: journalEntries.slice(2, 4),
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
      limit: 3,
      offset: 3,
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: journalEntries.slice(3),
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);

    const { errorMessage: errorMessage4, payload: tag4 } = await apiTag.getTag({
      slug: "test-tag-3",
      limit: 4,
      offset: 4,
    });

    const expectedTag4 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [],
    };

    expect(errorMessage4).toBeNull();

    expect(tag4).toEqual(expectedTag4);
  });

  it.skip("should get a tag with JEs sorted by date, asc", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      sort: {
        by: "date",
        order: "asc",
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries,
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);
  });

  it.skip("should get a tag with JEs sorted by date, desc", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },
        createdAt: expect.any(Date),

        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      sort: {
        by: "date",
        order: "desc",
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries,
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);
  });

  it.skip("shoud get a tag with JEs sorted by title, asc", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],
        material: {
          id: expect.any(String),

          type: MaterialType.CODE,
          content: "some code here",
        },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      sort: {
        by: "title",
        order: "asc",
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries,
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);
  });

  it.skip("should get a tag with JEs sorted by title, desc", async () => {
    const journalEntries = [
      {
        id: expect.any(String),
        title: "Z. First JE",
        description: "Z. First JE",
        content: "z first JE",
        slug: "z-first-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.QUOTE,
          content: "test JE 1",
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Link JE",
        description: "Link JE",
        content: "link JE",
        slug: "link-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.LINK,
          content: {
            url: "https://www.google.com",
            title: "Google",
            description: "Google",
            imageUrl:
              "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
          },
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "Code JE",
        description: "Code JE",
        content: "code JE",
        slug: "code-je",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.CODE,
          content: "some code here",
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
      {
        id: expect.any(String),
        title: "A. Last JE - Image",
        description: "A. Last JE - Image",
        content: "a last JE - image",
        slug: "a-last-je---image",
        tags: ["test tag 1", "test tag 2", "test tag 3"],

        material: {
          id: expect.any(String),
          type: MaterialType.IMAGE,
          content: expect.any(String),
        },

        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      },
    ];

    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      sort: {
        by: "title",
        order: "desc",
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries,
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);
  });

  it.skip("should get a tag with JEs filtered by materialType", async () => {
    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      filters: {
        materialType: MaterialType.CODE,
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Code JE",
          description: "Code JE",
          content: "code JE",
          slug: "code-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.CODE,
            content: "some code here",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
      filters: {
        materialType: MaterialType.LINK,
      },
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 2",
      slug: "test-tag-2",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Link JE",
          description: "Link JE",
          content: "link JE",
          slug: "link-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.LINK,
            content: {
              url: "https://www.google.com",
              title: "Google",
              description: "Google",
              imageUrl:
                "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            },
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
      filters: {
        materialType: MaterialType.IMAGE,
      },
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [
        {
          id: expect.any(String),
          title: "A. Last JE - Image",
          description: "A. Last JE - Image",
          content: "a last JE - image",
          slug: "a-last-je---image",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.IMAGE,
            content: expect.any(String),
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);

    const { errorMessage: errorMessage4, payload: tag4 } = await apiTag.getTag({
      slug: "test-tag-3",
      filters: {
        materialType: MaterialType.QUOTE,
      },
    });

    const expectedTag4 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Z. First JE",
          description: "Z. First JE",
          content: "z first JE",
          slug: "z-first-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 1",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage4).toBeNull();

    expect(tag4).toEqual(expectedTag4);
  }, 40000);

  it.skip("should get a tag with JEs filtered by keyword", async () => {
    const { errorMessage, payload: tag } = await apiTag.getTag({
      slug: "test-tag-1",
      filters: {
        keyword: "code",
      },
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Code JE",
          description: "Code JE",
          content: "code JE",
          slug: "code-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.CODE,
            content: "some code here",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-2",
      filters: {
        keyword: "link",
      },
    });

    const expectedTag2 = {
      id: expect.any(String),
      name: "test tag 2",
      slug: "test-tag-2",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Link JE",
          description: "Link JE",
          content: "link JE",
          slug: "link-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.LINK,
            content: {
              url: "https://www.google.com",
              title: "Google",
              description: "Google",
              imageUrl:
                "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
            },
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag2);

    const { errorMessage: errorMessage3, payload: tag3 } = await apiTag.getTag({
      slug: "test-tag-3",
      filters: {
        keyword: "image",
      },
    });

    const expectedTag3 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [
        {
          id: expect.any(String),
          title: "A. Last JE - Image",
          description: "A. Last JE - Image",
          content: "a last JE - image",
          slug: "a-last-je---image",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.IMAGE,
            content: expect.any(String),
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage3).toBeNull();

    expect(tag3).toEqual(expectedTag3);

    const { errorMessage: errorMessage4, payload: tag4 } = await apiTag.getTag({
      slug: "test-tag-3",
      filters: {
        keyword: "first",
      },
    });

    const expectedTag4 = {
      id: expect.any(String),
      name: "test tag 3",
      slug: "test-tag-3",
      journalEntries: [
        {
          id: expect.any(String),
          title: "Z. First JE",
          description: "Z. First JE",
          content: "z first JE",
          slug: "z-first-je",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 1",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    };

    expect(errorMessage4).toBeNull();

    expect(tag4).toEqual(expectedTag4);
  }, 40000);
});

describe.skip("APT/Update Tag", () => {
  beforeEach(_before);
  afterEach(_after);

  it("should update a tag", async () => {
    const { errorMessage, payload: tag } = await apiTag.updateTag({
      name: "test tag 1",
      newName: "test tag 1 updated",
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1 updated",
      slug: "test-tag-1-updated",
      journalEntries: [],
    };

    expect(errorMessage).toBeNull();

    expect(tag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-1-updated",
    });

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag);
  });
});

describe.skip("API/Empty tag", () => {
  beforeEach(async () => {
    const { errorMessage: eMAddJE } = await apiJE.addJournalEntry({
      title: "test JE 1",
      description: "test JE 1",
      content: "test JE 1",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 1",
      },
      tags: [
        {
          id: null,
          name: "test tag 1",
        },
      ],
    });

    if (eMAddJE) throw new Error(eMAddJE);

    const { errorMessage: eMAddJE4, payload: tags } = await apiTag.getTags({});

    if (eMAddJE4) throw new Error(eMAddJE4);

    const { errorMessage: eMAddJE2 } = await apiJE.addJournalEntry({
      title: "test JE 2",
      description: "test JE 2",
      content: "test JE 2",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 2",
      },
      tags: tags!.map((tag) => ({
        id: tag.id,
        name: null,
      })),
    });

    if (eMAddJE2) throw new Error(eMAddJE2);

    const { errorMessage: eMAddJE3 } = await apiJE.addJournalEntry({
      title: "test JE 3",
      description: "test JE 3",
      content: "test JE 3",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 3",
      },
      tags: tags!.map((tag) => ({
        id: tag.id,
        name: null,
      })),
    });

    if (eMAddJE3) throw new Error(eMAddJE3);
  }, 40000);

  afterEach(_after);

  it("should empty a tag", async () => {
    const { errorMessage, payload: tagCheck } = await apiTag.getTag({
      slug: "test-tag-1",
    });

    expect(errorMessage).toBeNull();

    expect(tagCheck).toEqual({
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [
        {
          id: expect.any(String),
          title: "test JE 1",
          description: "test JE 1",
          content: "test JE 1",
          slug: "test-je-1",
          tags: ["test tag 1"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 1",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          title: "test JE 2",
          description: "test JE 2",
          content: "test JE 2",
          slug: "test-je-2",
          tags: ["test tag 1"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 2",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          title: "test JE 3",
          description: "test JE 3",
          content: "test JE 3",
          slug: "test-je-3",
          tags: ["test tag 1"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 3",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    });

    const { errorMessage: eMEmpty, payload: emptyTag } = await apiTag.emptyTag({
      name: "test tag 1",
    });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [],
    };

    expect(eMEmpty).toBeNull();

    expect(emptyTag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-1",
    });

    expect(errorMessage2).toBeNull();

    expect(tag2).toEqual(expectedTag);
  }, 400000);
});

describe.skip("API/Delete tag", () => {
  beforeEach(async () => {
    const { errorMessage: eMAddJE } = await apiJE.addJournalEntry({
      title: "test JE 1",
      description: "test JE 1",
      content: "test JE 1",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 1",
      },
      tags: [
        {
          id: null,
          name: "test tag 1",
        },
        {
          id: null,
          name: "test tag 2",
        },
        {
          id: null,
          name: "test tag 3",
        },
      ],
    });

    if (eMAddJE) throw new Error(eMAddJE);

    const { errorMessage: eMAddJE4, payload: tags } = await apiTag.getTags({});

    if (eMAddJE4) throw new Error(eMAddJE4);

    const { errorMessage: eMAddJE2 } = await apiJE.addJournalEntry({
      title: "test JE 2",
      description: "test JE 2",
      content: "test JE 2",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 2",
      },
      tags: tags!.map((tag) => ({
        id: tag.id,
        name: null,
      })),
    });

    if (eMAddJE2) throw new Error(eMAddJE2);

    const { errorMessage: eMAddJE3 } = await apiJE.addJournalEntry({
      title: "test JE 3",
      description: "test JE 3",
      content: "test JE 3",
      material: {
        type: MaterialType.QUOTE,
        content: "test JE 3",
      },
      tags: tags!.map((tag) => ({
        id: tag.id,
        name: null,
      })),
    });

    if (eMAddJE3) throw new Error(eMAddJE3);
  }, 40000);

  afterEach(_after);

  it("should delete a tag", async () => {
    const { errorMessage, payload: tagCheck } = await apiTag.getTag({
      slug: "test-tag-1",
    });

    expect(errorMessage).toBeNull();

    expect(tagCheck).toEqual({
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [
        {
          id: expect.any(String),
          title: "test JE 1",
          description: "test JE 1",
          content: "test JE 1",
          slug: "test-je-1",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 1",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          title: "test JE 2",
          description: "test JE 2",
          content: "test JE 2",
          slug: "test-je-2",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 2",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          title: "test JE 3",
          description: "test JE 3",
          content: "test JE 3",
          slug: "test-je-3",
          tags: ["test tag 1", "test tag 2", "test tag 3"],
          material: {
            id: expect.any(String),
            type: MaterialType.QUOTE,
            content: "test JE 3",
          },
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
    });

    const { errorMessage: eMDelete, payload: deletedTag } =
      await apiTag.deleteTag({
        name: "test tag 1",
      });

    const expectedTag = {
      id: expect.any(String),
      name: "test tag 1",
      slug: "test-tag-1",
      journalEntries: [],
    };

    expect(eMDelete).toBeNull();

    expect(deletedTag).toEqual(expectedTag);

    const { errorMessage: errorMessage2, payload: tag2 } = await apiTag.getTag({
      slug: "test-tag-1",
    });

    expect(typeof errorMessage2).toBe("string");

    const { errorMessage: errorMessage3, payload: tags } = await apiTag.getTags(
      {}
    );

    expect(errorMessage3).toBeNull();

    expect(tags).toEqual([
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
    ]);
  }, 400000);
});
