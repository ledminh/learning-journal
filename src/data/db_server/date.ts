import prismaClient from "./prismaClient";

import { CreateDateEntryFunction } from "@/types/date";

export const createDate: CreateDateEntryFunction = async function () {
  try {
    const dbDate = await prismaClient.date.create({});

    return {
      errorMessage: null,
      payload: {
        ...dbDate,
        entries: [],
      },
    };
  } catch (e: any) {
    return {
      errorMessage: e.message,
      payload: null,
    };
  }
};
