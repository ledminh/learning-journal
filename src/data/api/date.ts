import * as dbDate from "@/data/db_server/date";
import { convertJournalEntryFromDBServer } from "@/data/server/journal_entry";
import { DateEntry } from "../server/types/date";
import { GetDateFunction } from "./types";

/**
 * Retrieves a list of dates from the API (without JE).
 * @param options - The options for pagination (limit and offset).
 * @returns A promise that resolves to either an object with an error message and a null payload,
 *          or an object with a null error message and an array of DateEntry objects as the payload.
 */
export function getDates(options: { limit: number; offset: number }): Promise<
  | {
      errorMessage: string;
      payload: null;
    }
  | {
      errorMessage: null;
      payload: DateEntry[];
    }
>;

/**
 * Retrieves a list of dates within a specified range. (with JE)
 * @param options - The options for retrieving the dates.
 * @param options.to - The end date of the range.
 * @param options.from - The start date of the range.
 * @returns A promise that resolves to either an object with an error message and a null payload,
 *          or an object with a null error message and an array of DateEntry objects as the payload.
 */
export function getDates(options: { to: Date; from: Date }): Promise<
  | {
      errorMessage: string;
      payload: null;
    }
  | {
      errorMessage: null;
      payload: DateEntry[];
    }
>;

/**
 * Retrieves a list of dates based on the provided options.
 * @param options - The options for retrieving the dates.
 * @returns A promise that resolves to either an object with an error message and a null payload, or an object with a null error message and a payload containing an array of DateEntry objects.
 */
export async function getDates(options: {
  limit?: number;
  offset?: number;
  to?: Date;
  from?: Date;
}): Promise<
  | {
      errorMessage: string;
      payload: null;
    }
  | {
      errorMessage: null;
      payload: DateEntry[];
    }
> {
  if (options.limit !== undefined && options.offset !== undefined) {
    return getDatesWithLimitAndOffset({
      limit: options.limit,
      offset: options.offset,
    });
  } else if (options.to !== undefined && options.from !== undefined) {
    return getDatesWithToAndFrom({
      to: options.to,
      from: options.from,
    });
  }

  return {
    errorMessage: "Invalid options",
    payload: null,
  };
}

/**
 * Retrieves a date from the API.
 * @param options - The options for retrieving the date.
 * @param options.date - The date to retrieve.
 * @returns A promise that resolves to either an object with an error message and a null payload, or an object with a null error message and a payload containing a DateEntry object or an object with a null error message and a null payload when there is no date entry and there is no error.
 */
export const getDate: GetDateFunction = async function ({ date }) {
  const { errorMessage, payload } = await dbDate.getDate({
    date,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  } else if (!payload) {
    return {
      errorMessage: null,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      id: payload!.id,
      date: payload!.date,
      journalEntries: payload!.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    },
  };
};

/************* HELPERS *************************/

async function getDatesWithLimitAndOffset(options: {
  limit: number;
  offset: number;
}) {
  const { errorMessage, payload } = await dbDate.getDates({
    options: {
      limit: options.limit,
      offset: options.offset,
    },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: payload!.map((dateEntry) => ({
      ...dateEntry,
      journalEntries: dateEntry.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    })),
  };
}

async function getDatesWithToAndFrom(options: { to: Date; from: Date }) {
  const { errorMessage, payload } = await dbDate.getDates({
    options: {
      to: options.to,
      from: options.from,
      includeJournalEntries: true,
    },
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: payload!.map((dateEntry) => ({
      ...dateEntry,
      journalEntries: dateEntry.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    })),
  };
}
