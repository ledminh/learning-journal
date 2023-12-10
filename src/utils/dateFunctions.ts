export function getStartOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getEndOfDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}
