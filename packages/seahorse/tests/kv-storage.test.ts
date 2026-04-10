import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.mock is hoisted — use vi.hoisted() for variables referenced in factories
const platform = vi.hoisted(() => ({ OS: "web" }));
vi.mock("react-native", () => ({ Platform: platform }));

const asyncStorageData = vi.hoisted<Record<string, string>>(() => ({}));
const mockAsyncStorage = vi.hoisted(() => ({
  getAllKeys: vi.fn(async () => Object.keys(asyncStorageData)),
  multiGet: vi.fn(async (keys: string[]) =>
    keys.map((k) => [k, asyncStorageData[k] ?? null] as [string, string | null]),
  ),
  setItem: vi.fn(async (key: string, value: string) => {
    asyncStorageData[key] = value;
  }),
}));
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: mockAsyncStorage,
}));

const nativeStore = vi.hoisted<Record<string, string>>(() => ({}));
const MockSQLiteStorage = vi.hoisted(() =>
  vi.fn().mockImplementation(() => ({
    getItemSync: (k: string) => nativeStore[k] ?? null,
    setItemSync: (k: string, v: string) => { nativeStore[k] = v; },
    removeItemSync: (k: string) => { delete nativeStore[k]; },
    getAllKeysSync: () => Object.keys(nativeStore),
    closeSync: vi.fn(),
  })),
);
vi.mock("expo-sqlite/kv-store", () => ({ SQLiteStorage: MockSQLiteStorage }));

import {
  initStorage,
  getStorage,
  closeStorage,
  readCollection,
  writeCollection,
} from "../src/utils/kv-storage";

describe("kv-storage — web platform", () => {
  beforeEach(() => {
    platform.OS = "web";
    Object.keys(asyncStorageData).forEach((k) => delete asyncStorageData[k]);
    closeStorage();
    vi.clearAllMocks();
    // Re-wire mock fns after clearAllMocks (closures over asyncStorageData still work)
    mockAsyncStorage.getAllKeys.mockImplementation(async () => Object.keys(asyncStorageData));
    mockAsyncStorage.multiGet.mockImplementation(async (keys: string[]) =>
      keys.map((k) => [k, asyncStorageData[k] ?? null] as [string, string | null]),
    );
    mockAsyncStorage.setItem.mockImplementation(async (key: string, value: string) => {
      asyncStorageData[key] = value;
    });
  });

  it("initStorage returns a non-null sentinel on web", async () => {
    const storage = await initStorage("db");
    expect(storage).not.toBeNull();
  });

  it("getStorage returns null before initStorage is called", () => {
    expect(getStorage()).toBeNull();
  });

  it("getStorage returns non-null after initStorage", async () => {
    await initStorage("db");
    expect(getStorage()).not.toBeNull();
  });

  it("initStorage pre-loads existing AsyncStorage keys into the cache", async () => {
    asyncStorageData["items"] = JSON.stringify([1, 2, 3]);
    await initStorage("db");
    expect(readCollection<number[]>("items")).toEqual([1, 2, 3]);
  });

  it("writeCollection + readCollection roundtrip on web", async () => {
    await initStorage("db");
    const data = { name: "test", values: [1, 2] };
    writeCollection("myKey", data);
    expect(readCollection("myKey")).toEqual(data);
  });

  it("readCollection returns null for missing key", async () => {
    await initStorage("db");
    expect(readCollection("nonexistent")).toBeNull();
  });

  it("writeCollection flushes value to AsyncStorage in background", async () => {
    await initStorage("db");
    writeCollection("bg", { x: 1 });
    await new Promise((r) => setTimeout(r, 0));
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith("bg", JSON.stringify({ x: 1 }));
  });

  it("readCollection returns null for malformed JSON in cache", async () => {
    asyncStorageData["bad"] = "not-json{{{";
    await initStorage("db");
    expect(readCollection("bad")).toBeNull();
  });

  it("closeStorage resets web state so getStorage returns null", async () => {
    await initStorage("db");
    closeStorage();
    expect(getStorage()).toBeNull();
  });
});

describe("kv-storage — native platform", () => {
  beforeEach(() => {
    platform.OS = "ios";
    Object.keys(nativeStore).forEach((k) => delete nativeStore[k]);
    closeStorage();
    MockSQLiteStorage.mockClear();
  });

  it("initStorage creates a SQLiteStorage instance", async () => {
    await initStorage("mydb");
    expect(MockSQLiteStorage).toHaveBeenCalledWith("mydb");
  });

  it("getStorage returns the SQLiteStorage instance after init", async () => {
    await initStorage("mydb");
    expect(getStorage()).not.toBeNull();
  });

  it("writeCollection + readCollection roundtrip on native", async () => {
    await initStorage("mydb");
    writeCollection("key", { a: 1 });
    expect(readCollection("key")).toEqual({ a: 1 });
  });

  it("readCollection returns null for missing key on native", async () => {
    await initStorage("mydb");
    expect(readCollection("absent")).toBeNull();
  });

  it("closeStorage resets native state so getStorage returns null", async () => {
    await initStorage("mydb");
    closeStorage();
    expect(getStorage()).toBeNull();
  });
});
