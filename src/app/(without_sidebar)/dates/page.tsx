import {
  getDatesOfMonth,
  getNewestMonth,
  getOldestMonth,
} from "@/data/api/date";
import { DateList } from "@/ui/date";

export default async function DatesPage() {
  const [
    { errorMessage: newestMonthErr, payload: newestMonthPayload },
    { errorMessage: oldestMonthErr, payload: oldestMonthPayload },
    { errorMessage, payload },
  ] = await Promise.all([
    getNewestMonth(),
    getOldestMonth(),
    getDatesOfNewestMonth(),
  ]);

  if (newestMonthErr) {
    return <div className="p-2 bg-red-100">{newestMonthErr}</div>;
  }

  if (oldestMonthErr) {
    return <div className="p-2 bg-red-100">{oldestMonthErr}</div>;
  }

  if (errorMessage) {
    return <div className="p-2 bg-red-100">{errorMessage}</div>;
  }

  if (!payload || !newestMonthPayload || !oldestMonthPayload) {
    return <div className="p-2 bg-red-100">No Date Entry found!</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-bold">List of entries organized by date</h3>
      <DateList
        initDateEntries={payload}
        newestMonth={newestMonthPayload.date}
        oldestMonth={oldestMonthPayload.date}
      />
    </div>
  );
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
