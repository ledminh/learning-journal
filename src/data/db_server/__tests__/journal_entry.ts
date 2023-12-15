import {
  addJournalEntry,
  getJournalEntry,
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/data/db_server/journal_entry";

import { deleteMaterial } from "@/data/db_server/material";

import { createAndAddDate, deleteDate } from "@/data/db_server/date";

import { MaterialType } from "@/data/db_server/types/material";
import { addTags, deleteTag, getTags } from "../tag";

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
  dateID: "",
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
};

describe.skip("Journal Entry functions", () => {
  beforeAll(async () => {
    const tags = await addTags(data.tags);

    if (tags.errorMessage) {
      throw new Error(tags.errorMessage);
    }

    data.tagIDs = tags.payload?.map((tag) => tag.id) as string[];

    const date = await createAndAddDate({});

    if (date.errorMessage) {
      throw new Error(date.errorMessage);
    }

    data.dateID = date.payload?.id as string;
  });

  afterAll(async () => {
    await Promise.all([
      ...data.tags.map((tag) => deleteTag({ name: tag.name })),
      deleteDate({ date: new Date() }),
    ]);
  });

  it("should add a journal entry", async () => {
    const dataToAddLinkJE = {
      ...data.journalEntries[0],
      tagIDs: data.tagIDs,
      date: { id: data.dateID },
    };

    const linkJE = await addJournalEntry(dataToAddLinkJE);

    expect(linkJE.errorMessage).toBeNull();

    expect(linkJE.payload).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      title: dataToAddLinkJE.title,
      slug: dataToAddLinkJE.slug,
      description: dataToAddLinkJE.description,
      material: {
        id: expect.any(String),
        type: dataToAddLinkJE.material.type,
        content: dataToAddLinkJE.material.content,
        createdAt: expect.any(Date),
      },
      content: dataToAddLinkJE.content,
      tags: data.tags.map((tag) => tag.name),
    });
  });

  it("should get a journal entry", async () => {
    const dataToAddQuoteJE = {
      ...data.journalEntries[1],
      tagIDs: data.tagIDs,
      date: { id: data.dateID },
    };

    const quoteJE = await addJournalEntry(dataToAddQuoteJE);

    expect(quoteJE.errorMessage).toBeNull();

    const dbQuoteJE = await getJournalEntry({
      slug: quoteJE.payload?.slug as string,
    });

    expect(dbQuoteJE.errorMessage).toBeNull();

    expect(dbQuoteJE.payload).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      title: dataToAddQuoteJE.title,
      slug: dataToAddQuoteJE.slug,
      description: dataToAddQuoteJE.description,
      material: {
        id: expect.any(String),
        type: dataToAddQuoteJE.material.type,
        content: dataToAddQuoteJE.material.content,
        createdAt: expect.any(Date),
      },
      content: dataToAddQuoteJE.content,
      tags: data.tags.map((tag) => tag.name),
    });
  });

  it("should get journal entries", async () => {
    const journalEntries = await getJournalEntries({});

    expect(journalEntries.errorMessage).toBeNull();

    expect(journalEntries.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[0].title,
        slug: data.journalEntries[0].slug,
        description: data.journalEntries[0].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[0].material.type,
          content: data.journalEntries[0].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[0].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);
  });

  it("should get journal entries with limit and offset", async () => {
    const addResults = Promise.all([
      addJournalEntry({
        ...data.journalEntries[2],
        tagIDs: data.tagIDs,
        date: { id: data.dateID },
      }),
      addJournalEntry({
        ...data.journalEntries[3],
        tagIDs: data.tagIDs,
        date: { id: data.dateID },
      }),
    ]);

    if ((await addResults).some((result) => result.errorMessage)) {
      throw new Error("Failed to add journal entries");
    }

    const journalEntries = await getJournalEntries({
      limit: 1,
      offset: 1,
    });

    expect(journalEntries.errorMessage).toBeNull();

    expect(journalEntries.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries2 = await getJournalEntries({
      limit: 2,
      offset: 2,
    });

    expect(journalEntries2.errorMessage).toBeNull();

    expect(journalEntries2.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries3 = await getJournalEntries({
      limit: 2,
      offset: 3,
    });

    expect(journalEntries3.errorMessage).toBeNull();

    expect(journalEntries3.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries4 = await getJournalEntries({
      limit: 2,
      offset: 4,
    });

    expect(journalEntries4.errorMessage).toBeNull();

    expect(journalEntries4.payload).toEqual([]);

    const journalEntries5 = await getJournalEntries({
      limit: 1,
    });

    expect(journalEntries5.errorMessage).toBeNull();

    expect(journalEntries5.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[0].title,
        slug: data.journalEntries[0].slug,
        description: data.journalEntries[0].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[0].material.type,
          content: data.journalEntries[0].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[0].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries6 = await getJournalEntries({
      offset: 1,
    });

    expect(journalEntries6.errorMessage).toBeNull();

    expect(journalEntries6.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);
  }, 20000);

  it("should get journal entries filtered by keyword", async () => {
    const journalEntries = await getJournalEntries({
      filters: {
        keyword: "Test Journal Entry 3",
      },
    });

    expect(journalEntries.errorMessage).toBeNull();

    expect(journalEntries.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries2 = await getJournalEntries({
      filters: {
        keyword: "Test Journal Entry",
      },
    });

    expect(journalEntries2.errorMessage).toBeNull();

    expect(journalEntries2.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[0].title,
        slug: data.journalEntries[0].slug,
        description: data.journalEntries[0].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[0].material.type,
          content: data.journalEntries[0].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[0].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);
  });

  it("should get journal entries filtered by date", async () => {
    const journalEntries = await getJournalEntries({
      filters: {
        date: new Date(),
      },
    });

    expect(journalEntries.errorMessage).toBeNull();

    expect(journalEntries.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[0].title,
        slug: data.journalEntries[0].slug,
        description: data.journalEntries[0].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[0].material.type,
          content: data.journalEntries[0].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[0].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries2 = await getJournalEntries({
      filters: {
        date: new Date(0),
      },
    });

    expect(journalEntries2.errorMessage).toBeNull();
    expect(journalEntries2.payload).toEqual([]);
  });

  it("should get journal entries filtered by material type", async () => {
    const journalEntries = await getJournalEntries({
      filters: {
        materialType: MaterialType.Link,
      },
    });

    expect(journalEntries.errorMessage).toBeNull();

    expect(journalEntries.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[0].title,
        slug: data.journalEntries[0].slug,
        description: data.journalEntries[0].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[0].material.type,
          content: data.journalEntries[0].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[0].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries2 = await getJournalEntries({
      filters: {
        materialType: MaterialType.Quote,
      },
    });

    expect(journalEntries2.errorMessage).toBeNull();

    expect(journalEntries2.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[1].title,
        slug: data.journalEntries[1].slug,
        description: data.journalEntries[1].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[1].material.type,
          content: data.journalEntries[1].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[1].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries3 = await getJournalEntries({
      filters: {
        materialType: MaterialType.Image,
      },
    });

    expect(journalEntries3.errorMessage).toBeNull();

    expect(journalEntries3.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[2].title,
        slug: data.journalEntries[2].slug,
        description: data.journalEntries[2].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[2].material.type,
          content: data.journalEntries[2].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[2].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);

    const journalEntries4 = await getJournalEntries({
      filters: {
        materialType: MaterialType.Code,
      },
    });

    expect(journalEntries4.errorMessage).toBeNull();

    expect(journalEntries4.payload).toEqual([
      {
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        title: data.journalEntries[3].title,
        slug: data.journalEntries[3].slug,
        description: data.journalEntries[3].description,
        material: {
          id: expect.any(String),
          type: data.journalEntries[3].material.type,
          content: data.journalEntries[3].material.content,
          createdAt: expect.any(Date),
        },
        content: data.journalEntries[3].content,
        tags: data.tags.map((tag) => tag.name),
      },
    ]);
  });

  it("should update a journal entry", async () => {
    const dbLinkJE = await getJournalEntry({
      slug: data.journalEntries[0].slug,
    });

    expect(dbLinkJE.errorMessage).toBeNull();

    const tags = await getTags({
      names: data.tags.map((tag) => tag.name),
    });

    expect(tags.errorMessage).toBeNull();

    const newTags = await addTags([
      {
        name: "New Tag 1",
        slug: "new-tag-1",
      },
      {
        name: "New Tag 2",
        slug: "new-tag-2",
      },
    ]);

    expect(newTags.errorMessage).toBeNull();

    const newTagIDs = newTags.payload?.map((tag) => tag.id) as string[];

    const tagIDs = [
      ...(tags.payload?.map((tag) => tag.id) as string[]).slice(0, 2),
      ...newTagIDs,
    ];

    const updatedLinkJE = await updateJournalEntry({
      id: dbLinkJE.payload?.id as string,
      title: "Updated Journal Entry Title",
      slug: "updated-journal-entry-title",
      description: "Updated Description",
      content: "Updated Content",
      material: {
        id: dbLinkJE.payload?.material.id as string,
        type: MaterialType.Image,
        content: "https://www.google.com",
        createdAt: dbLinkJE.payload?.material.createdAt as Date,
      },
      tagIDs,
    });

    expect(updatedLinkJE.errorMessage).toBeNull();

    expect(updatedLinkJE.payload).toEqual({
      id: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      title: "Updated Journal Entry Title",
      slug: "updated-journal-entry-title",
      description: "Updated Description",
      material: {
        id: expect.any(String),
        type: MaterialType.Image,
        content: "https://www.google.com",
        createdAt: expect.any(Date),
      },
      content: "Updated Content",
      tags: [
        data.tags[0].name,
        data.tags[1].name,
        newTags.payload?.[0].name as string,
        newTags.payload?.[1].name as string,
      ],
    });

    const deleteTags = await Promise.all(
      newTagIDs.map((tagID, i) =>
        deleteTag({ name: newTags.payload?.[i].name as string })
      )
    );

    expect(deleteTags.every((result) => result.payload)).toBeTruthy();
  }, 20000);

  it("should delete journal entries", async () => {
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
  });
});
