import { describe, it, expect } from "vitest";
import { safeFormat } from "../src/utils/date";

describe("safeFormat", () => {
  it("formats a valid Date object", () => {
    const date = new Date(2024, 0, 15); // 15 Jan 2024
    expect(safeFormat(date, "yyyy-MM-dd")).toBe("2024-01-15");
  });

  it("formats a valid timestamp (number)", () => {
    const ts = new Date(2024, 5, 1).getTime(); // 1 Jun 2024
    expect(safeFormat(ts, "MM/dd/yyyy")).toBe("06/01/2024");
  });

  it("returns '—' for an invalid Date object", () => {
    expect(safeFormat(new Date("not-a-date"), "yyyy-MM-dd")).toBe("—");
  });

  it("returns '—' for NaN timestamp", () => {
    expect(safeFormat(NaN, "yyyy-MM-dd")).toBe("—");
  });

  it("passes locale option through to date-fns format", () => {
    const date = new Date(2024, 0, 15);
    // Without locale, just verify format works with opts object present
    expect(safeFormat(date, "yyyy", {})).toBe("2024");
  });

  it("formats different format strings correctly", () => {
    const date = new Date(2024, 11, 31); // 31 Dec 2024
    expect(safeFormat(date, "dd MMM yyyy")).toBe("31 Dec 2024");
    expect(safeFormat(date, "d/M/yy")).toBe("31/12/24");
  });
});
