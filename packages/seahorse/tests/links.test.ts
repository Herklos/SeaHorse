import { describe, it, expect } from "vitest";
import { parseLinks, serializeLinks, isValidUrl } from "../src/utils/links";

describe("parseLinks", () => {
  it("returns empty array for null", () => {
    expect(parseLinks(null)).toEqual([]);
  });

  it("returns empty array for undefined", () => {
    expect(parseLinks(undefined)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseLinks("")).toEqual([]);
  });

  it("returns single URL as array", () => {
    expect(parseLinks("https://example.com")).toEqual(["https://example.com"]);
  });

  it("parses JSON array of URLs", () => {
    const json = JSON.stringify(["https://a.com", "https://b.com"]);
    expect(parseLinks(json)).toEqual(["https://a.com", "https://b.com"]);
  });
});

describe("serializeLinks", () => {
  it("returns null for empty array", () => {
    expect(serializeLinks([])).toBeNull();
  });

  it("returns null for whitespace-only entries", () => {
    expect(serializeLinks(["  ", ""])).toBeNull();
  });

  it("returns single URL as plain string", () => {
    expect(serializeLinks(["https://example.com"])).toBe("https://example.com");
  });

  it("returns JSON array for multiple URLs", () => {
    const result = serializeLinks(["https://a.com", "https://b.com"]);
    expect(JSON.parse(result!)).toEqual(["https://a.com", "https://b.com"]);
  });
});

describe("isValidUrl", () => {
  it("accepts https URLs", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });

  it("accepts http URLs", () => {
    expect(isValidUrl("http://example.com")).toBe(true);
  });

  it("rejects non-URLs", () => {
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("ftp://example.com")).toBe(false);
  });

  it("handles leading whitespace", () => {
    expect(isValidUrl("  https://example.com")).toBe(true);
  });
});
