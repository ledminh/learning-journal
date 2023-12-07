import prismaClient from "./prismaClient";

import { CreateAndAddDateEntryFunction } from "@/types/date";

export const createAndAddDate: CreateAndAddDateEntryFunction =
  async function () {
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
