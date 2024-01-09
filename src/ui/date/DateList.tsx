"use client";

import { DateEntry } from "@/data/server/types/date";
import Link from "next/link";
import { useState } from "react";
import { LeftArrowTip, RightArrowTip } from "@/ui/ArrowTip";
import getDatesOfMonth from "@/data/api_call/getDatesOfMonth";

interface Props {
  initDateEntries: DateEntry[];
  newestMonth: Date;
  oldestMonth: Date;
}

export default function DateList({
  initDateEntries,
  newestMonth,
  oldestMonth,
}: Props) {
  const [dateEntries, setDateEntries] = useState(initDateEntries);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setNextMonth = async () => {
    const nextMonth = getNextMonth(dateEntries[0].date);

    setIsLoading(true);
    const { errorMessage, payload } = await getDatesOfMonth(nextMonth);

    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    if (!payload) {
      setDateEntries([]);
      return;
    }

    setDateEntries(payload);
    setIsLoading(false);
  };

  const setPrevMonth = async () => {
    const prevMonth = getPrevMonth(dateEntries[0].date);

    setIsLoading(true);
    const { errorMessage, payload } = await getDatesOfMonth(prevMonth);

    if (errorMessage) {
      setErrorMessage(errorMessage);
      return;
    }

    if (!payload) {
      setDateEntries([]);
      return;
    }

    setDateEntries(payload);
    setIsLoading(false);
  };

  return (
    <div className={"flex flex-col gap-4" + (isLoading ? " opacity-20" : "")}>
      <div className="flex items-center justify-between p-2 text-xl font-bold bg-blue-100">
        <Button
          onClick={setPrevMonth}
          disabled={isEqualMonth(dateEntries[0].date, oldestMonth)}
        >
          <LeftArrowTip
            disabled={isEqualMonth(dateEntries[0].date, oldestMonth)}
          />
        </Button>
        <h4>{getMonthYearString(dateEntries[0].date)}</h4>
        <Button
          onClick={setNextMonth}
          disabled={isEqualMonth(dateEntries[0].date, newestMonth)}
        >
          <RightArrowTip
            disabled={isEqualMonth(dateEntries[0].date, newestMonth)}
          />
        </Button>
      </div>
      {errorMessage && (
        <div className="p-2 text-red-500 bg-red-100">{errorMessage}</div>
      )}
      {dateEntries.length === 0 && (
        <div className="p-2 text-red-500 bg-red-100">No Date Entry found!</div>
      )}
      {dateEntries.length > 0 && (
        <ul className="flex flex-col gap-6">
          {dateEntries.map((dateEntry) => (
            <li key={dateEntry.id} className="flex flex-col gap-3">
              <h4 className="p-2 text-xl font-semibold bg-neutral-200">
                {dateEntry.date.toLocaleDateString()}
              </h4>
              <ul className="p-2">
                {dateEntry.journalEntries.map((journalEntry) => (
                  <li key={journalEntry.id}>
                    <Link
                      href={"/entry/" + journalEntry.slug}
                      className="text-blue-600 underline"
                    >
                      {journalEntry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/******************************
 * Components
 */
const Button = (props: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`p-2 rounded-full ${
        props.disabled ? "cursor-not-allowed" : "hover:bg-blue-300"
      } `}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

/******************************
 * Helpers
 */
const getMonthYearString = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const isEqualMonth = (date1: Date, date2: Date) => {
  return (
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const getNextMonth = (date: Date) => {
  const nextMonth = new Date(date);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth;
};

const getPrevMonth = (date: Date) => {
  const prevMonth = new Date(date);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
};
