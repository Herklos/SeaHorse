import { describe, it, expect } from "vitest";
import { handlePinDigit, handlePinDelete } from "../src/utils/pin-helpers";

describe("handlePinDigit", () => {
  it("appends digit when pin is shorter than pinLength", () => {
    const result = handlePinDigit("12", "3", 4);
    expect(result).toEqual({ nextPin: "123", isComplete: false });
  });

  it("sets isComplete true when pin reaches pinLength", () => {
    const result = handlePinDigit("123", "4", 4);
    expect(result).toEqual({ nextPin: "1234", isComplete: true });
  });

  it("ignores digit when pin is already at capacity", () => {
    const result = handlePinDigit("1234", "5", 4);
    expect(result).toEqual({ nextPin: "1234", isComplete: false });
  });

  it("works for empty pin", () => {
    const result = handlePinDigit("", "7", 4);
    expect(result).toEqual({ nextPin: "7", isComplete: false });
  });

  it("works for pinLength of 6", () => {
    const result = handlePinDigit("12345", "6", 6);
    expect(result).toEqual({ nextPin: "123456", isComplete: true });
  });

  it("completes immediately for pinLength of 1", () => {
    const result = handlePinDigit("", "9", 1);
    expect(result).toEqual({ nextPin: "9", isComplete: true });
  });
});

describe("handlePinDelete", () => {
  it("removes last character", () => {
    expect(handlePinDelete("123")).toBe("12");
  });

  it("removes last character of single-char pin", () => {
    expect(handlePinDelete("5")).toBe("");
  });

  it("returns empty string for empty pin", () => {
    expect(handlePinDelete("")).toBe("");
  });

  it("removes last digit from full pin", () => {
    expect(handlePinDelete("1234")).toBe("123");
  });
});
