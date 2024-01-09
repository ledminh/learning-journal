import Link from "next/link";

import { getDatesOfMonth, getNewestMonth } from "@/data/api/date";
import { DateList } from "@/ui/date";

export default async function DatesPage() {
  const { errorMessage, payload } = await getDatesOfNewestMonth();

  if (errorMessage) {
    return <div className="p-2 bg-red-100">{errorMessage}</div>;
  }

  if (!payload) {
    return <div className="p-2 bg-red-100">No Date Entry found!</div>;
  }

  return <DateList dateEntries={payload} />;
}

/*******************************
 * Helpers
 */

const getDatesOfNewestMonth = async () => {
  const { errorMessage: newestMonthErr, payload: newestMonthPayload } =
    await getNewestMonth();

  if (newestMonthErr) {
    return { errorMessage: newestMonthErr, payload: null };
  }

  if (!newestMonthPayload) {
    return { errorMessage: "No Date Entry found!", payload: null };
  }

  const { errorMessage, payload } = await getDatesOfMonth(
    newestMonthPayload.date
  );

  if (errorMessage) {
    return { errorMessage, payload: null };
  }

  if (!payload) {
    return { errorMessage: "No Date Entry found!", payload: null };
  }

  return { errorMessage: null, payload };
};
