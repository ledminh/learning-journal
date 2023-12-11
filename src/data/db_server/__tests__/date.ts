import {
  createAndAddDate,
  getDate,
  getDates,
  deleteDate,
} from "@/data/db_server/date";
import { getStartOfDate } from "@/utils/dateFunctions";

describe.skip("Date functions", () => {
  const today = getStartOfDate(new Date());
  const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24);
  const someRandomDay = getStartOfDate(new Date(2021, 1, 1));

  it("should create and add current date", async () => {
    const dbToday = await createAndAddDate({});

    expect(dbToday.errorMessage).toBeNull();

    expect(dbToday.payload).toEqual({
      id: expect.any(String),
      date: today,
      journalEntries: [],
    });
  });

  it("should create and add a random date", async () => {
    const dbYesterday = await createAndAddDate({
      date: yesterday,
    });

    expect(dbYesterday.errorMessage).toBeNull();

    expect(dbYesterday.payload).toEqual({
      id: expect.any(String),
      date: yesterday,
      journalEntries: [],
    });

    const dbSomeRandomDay = await createAndAddDate({
      date: someRandomDay,
    });

    expect(dbSomeRandomDay.errorMessage).toBeNull();

    expect(dbSomeRandomDay.payload).toEqual({
      id: expect.any(String),
      date: someRandomDay,
      journalEntries: [],
    });
  });

  it("should have unique dates", async () => {
    const dbAnotherToday = await createAndAddDate({});
    expect(typeof dbAnotherToday.errorMessage).toBe("string");

    const dbAnotherYesterday = await createAndAddDate({
      date: yesterday,
    });
    expect(typeof dbAnotherYesterday.errorMessage).toBe("string");

    const dbAnotherSomeRandomDay = await createAndAddDate({
      date: someRandomDay,
    });
    expect(typeof dbAnotherSomeRandomDay.errorMessage).toBe("string");
  });

  it("should get an empty date", async () => {
    const date = await getDate({ date: today });

    expect(date).toBeDefined();
    expect(date.errorMessage).toBeNull();
    expect(date.payload?.date).toEqual(today);

    const dbYesterday = await getDate({ date: yesterday });

    expect(dbYesterday).toBeDefined();
    expect(dbYesterday.errorMessage).toBeNull();
    expect(dbYesterday.payload?.date).toEqual(yesterday);

    const dbSomeRandomDay = await getDate({ date: someRandomDay });

    expect(dbSomeRandomDay).toBeDefined();
    expect(dbSomeRandomDay.errorMessage).toBeNull();
    expect(dbSomeRandomDay.payload?.date).toEqual(someRandomDay);
  });

  it.skip("should get a date with all journal entries. Default options (Ascending title. No filter.)", async () => {});

  it.skip("should get a date with all journal entries being sorted.", async () => {});

  it.skip("should get a date with journal entries being filtered.", async () => {});

  it.skip("should get a date with journal entries with limit and offset.", async () => {});

  it("should get all dates with empty journal entries. Default options (asc order)", async () => {
    const dates = await getDates({});

    expect(dates).toBeDefined();
    expect(dates.errorMessage).toBeNull();

    expect(dates.payload).toEqual([
      {
        id: expect.any(String),
        date: someRandomDay,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: yesterday,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: today,
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
        date: today,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: yesterday,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: someRandomDay,
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
        date: someRandomDay,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: yesterday,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: today,
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
        date: yesterday,
        journalEntries: [],
      },
      {
        id: expect.any(String),
        date: today,
        journalEntries: [],
      },
    ]);
  });

  it.skip("should get dates with journal entries. Default options (Ascending title. No filter.)", async () => {});

  it.skip("should get dates with journal entries being sorted.", async () => {});

  it.skip("should get dates with journal entries being filtered.", async () => {});

  it("should delete dates", async () => {
    const date = await deleteDate({ date: today });

    expect(date).toBeDefined();

    expect(date.errorMessage).toBeNull();
    expect(date.payload).toEqual({
      id: expect.any(String),
      date: today,
      journalEntries: [],
    });

    const dbYesterday = await deleteDate({ date: yesterday });

    expect(dbYesterday).toBeDefined();

    expect(dbYesterday.errorMessage).toBeNull();
    expect(dbYesterday.payload).toEqual({
      id: expect.any(String),
      date: yesterday,
      journalEntries: [],
    });

    const dbSomeRandomDay = await deleteDate({ date: someRandomDay });

    expect(dbSomeRandomDay).toBeDefined();

    expect(dbSomeRandomDay.errorMessage).toBeNull();
    expect(dbSomeRandomDay.payload).toEqual({
      id: expect.any(String),
      date: someRandomDay,
      journalEntries: [],
    });
  });
});
