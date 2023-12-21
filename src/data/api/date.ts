import * as dbDate from "@/data/db_server/date";
import { convertJournalEntryFromDBServer } from "@/data/server/journal_entry";
import { DateEntry } from "../server/types/date";
import { GetDateFunction } from "./types";

// Get DateEntry[] without journalEntries
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

// Get DateEntry[] with journalEntries
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

export const getDate: GetDateFunction = async function ({ date }) {
  const { errorMessage, payload } = await dbDate.getDate({
    date,
  });

  if (errorMessage) {
    return {
      errorMessage,
      payload: null,
    };
  }

  return {
    errorMessage: null,
    payload: {
      ...payload,
      journalEntries: payload?.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    } as DateEntry,
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
    payload: payload?.map((dateEntry) => ({
      ...dateEntry,
      journalEntries: dateEntry.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    })) as DateEntry[],
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
    payload: payload?.map((dateEntry) => ({
      ...dateEntry,
      journalEntries: dateEntry.journalEntries.map(
        convertJournalEntryFromDBServer
      ),
    })) as DateEntry[],
  };
}
