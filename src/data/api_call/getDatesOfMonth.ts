import { GetDatesOfMonthFunction } from "../api/types";
import post from "./post";

const getDatesOfMonth: GetDatesOfMonthFunction = async (date: Date) => {
  const { errorMessage, payload } = await post({
    url: "/api/get_dates_of_month",
    body: {
      date: date.toISOString(),
    },
  });

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  if (payload === null) {
    return { errorMessage: null, payload: null };
  }

  return {
    errorMessage: null,
    payload: payload!.map((dateEntry: any) => ({
      id: dateEntry.id,
      date: new Date(dateEntry.date),
      journalEntries: dateEntry.journalEntries.map((journalEntry: any) => {
        return {
          id: journalEntry.id,
          slug: journalEntry.slug,
          createdAt: new Date(journalEntry.createdAt),
          updatedAt: new Date(journalEntry.updatedAt),
          title: journalEntry.title,
          description: journalEntry.description,
          material: {
            id: journalEntry.material.id,
            type: journalEntry.material.type,
            content: journalEntry.material.content,
          },
          content: journalEntry.content,
          tags: journalEntry.tags,
        };
      }),
    })),
  };
};

export default getDatesOfMonth;
