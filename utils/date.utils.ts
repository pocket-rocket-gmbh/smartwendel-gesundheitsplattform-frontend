import { DateTime } from "luxon";

const units: Intl.RelativeTimeFormatUnit[] = ["year", "month", "week", "day", "hour", "minute", "second"];

export const timeAgo = (date: Date | string) => {
  const dateTime = typeof date === "string" ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

  if (dateTime.invalidReason) return date;

  const diff = dateTime.diffNow().shiftTo(...units);
  const unit = units.find((unit) => diff.get(unit) !== 0) || "second";

  const relativeFormatter = new Intl.RelativeTimeFormat("de", {
    numeric: "auto",
  });

  return relativeFormatter.format(Math.trunc(diff.as(unit)), unit);
};
