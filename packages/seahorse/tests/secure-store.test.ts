import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.mock is hoisted — use vi.hoisted() for variables referenced in factories
const platform = vi.hoisted(() => ({ OS: "web" }));
vi.mock("react-native", () => ({ Platform: platform }));

const mockSecureStore = vi.hoisted(() => ({
  getItemAsync: vi.fn<[string], Promise<string | null>>(),
  setItemAsync: vi.fn<[string, string], Promise<void>>(),
  deleteItemAsync: vi.fn<[string], Promise<void>>(),
}));
vi.mock("expo-secure-store", () => mockSecureStore);

// Stub localStorage for the web path (not available in node environment)
const localStorageStore: Record<string, string> = {};
vi.stubGlobal("localStorage", {
  getItem: (k: string) => localStorageStore[k] ?? null,
  setItem: (k: string, v: string) => { localStorageStore[k] = v; },
  removeItem: (k: string) => { delete localStorageStore[k]; },
});

import { secureGet, secureSet, secureDelete } from "../src/utils/secure-store";

describe("secure-store — web platform", () => {
  beforeEach(() => {
    platform.OS = "web";
    Object.keys(localStorageStore).forEach((k) => delete localStorageStore[k]);
    vi.clearAllMocks();
  });

  it("secureSet stores value in localStorage", async () => {
    await secureSet("foo", "bar");
    expect(localStorageStore["foo"]).toBe("bar");
  });

  it("secureGet retrieves stored value", async () => {
    localStorageStore["key"] = "value";
    expect(await secureGet("key")).toBe("value");
  });

  it("secureGet returns null for missing key", async () => {
    expect(await secureGet("missing")).toBeNull();
  });

  it("secureDelete removes the key", async () => {
    localStorageStore["del"] = "gone";
    await secureDelete("del");
    expect(localStorageStore["del"]).toBeUndefined();
  });

  it("does not call expo-secure-store on web", async () => {
    await secureSet("x", "1");
    await secureGet("x");
    await secureDelete("x");
    expect(mockSecureStore.setItemAsync).not.toHaveBeenCalled();
    expect(mockSecureStore.getItemAsync).not.toHaveBeenCalled();
    expect(mockSecureStore.deleteItemAsync).not.toHaveBeenCalled();
  });
});

describe("secure-store — native platform", () => {
  beforeEach(() => {
    platform.OS = "ios";
    vi.clearAllMocks();
  });

  it("secureSet delegates to expo-secure-store", async () => {
    mockSecureStore.setItemAsync.mockResolvedValue(undefined);
    await secureSet("key", "val");
    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith("key", "val");
  });

  it("secureGet delegates to expo-secure-store", async () => {
    mockSecureStore.getItemAsync.mockResolvedValue("stored");
    const result = await secureGet("key");
    expect(result).toBe("stored");
    expect(mockSecureStore.getItemAsync).toHaveBeenCalledWith("key");
  });

  it("secureGet returns null when expo-secure-store returns null", async () => {
    mockSecureStore.getItemAsync.mockResolvedValue(null);
    expect(await secureGet("absent")).toBeNull();
  });

  it("secureDelete delegates to expo-secure-store", async () => {
    mockSecureStore.deleteItemAsync.mockResolvedValue(undefined);
    await secureDelete("key");
    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith("key");
  });
});
