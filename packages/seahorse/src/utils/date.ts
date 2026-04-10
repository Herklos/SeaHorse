import { format as fnsFormat, isValid, type Locale } from "date-fns";

/** format() wrapper that returns a fallback string instead of throwing on invalid dates */
export function safeFormat(
  date: Date | number,
  fmt: string,
  opts?: { locale?: Locale },
): string {
  if (!isValid(date)) return "—";
  return fnsFormat(date, fmt, opts);
}
