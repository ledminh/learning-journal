export function getStartOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEndOfDate(date: Date) {
  const nextDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  return new Date(nextDay.getTime() - 1);
}
