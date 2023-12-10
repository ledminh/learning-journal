import {
  createAndAddDate,
  getDate,
  getDates,
  deleteDate,
} from "@/data/db_server/date";
import { getStartOfDate } from "@/utils/dateFunctions";

describe("Date functions", () => {
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

  it("should get a date", async () => {
    const date = await getDate({ date: new Date() });

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

  it("should get dates", () => {
    expect(getDates).toBeDefined();
  });

  //   it("should delete a date", () => {
  //     expect(deleteDate).toBeDefined();
  //   });
});
