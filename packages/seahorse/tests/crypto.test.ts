import { describe, it, expect } from "vitest";
import { generateKey, encryptData, decryptData } from "../src/utils/crypto";

describe("generateKey", () => {
  it("returns a 64-character hex string", async () => {
    const key = await generateKey();
    expect(key).toHaveLength(64);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it("generates unique keys", async () => {
    const k1 = await generateKey();
    const k2 = await generateKey();
    expect(k1).not.toBe(k2);
  });
});

describe("encryptData / decryptData", () => {
  it("roundtrip: decrypted output matches original", async () => {
    const key = await generateKey();
    const original = "Hello, world!";
    const encrypted = await encryptData(original, key);
    const decrypted = await decryptData(encrypted, key);
    expect(decrypted).toBe(original);
  });

  it("produces different ciphertext each call (random IV)", async () => {
    const key = await generateKey();
    const msg = "same message";
    const e1 = await encryptData(msg, key);
    const e2 = await encryptData(msg, key);
    expect(e1).not.toBe(e2);
  });

  it("fails to decrypt with wrong key", async () => {
    const key1 = await generateKey();
    const key2 = await generateKey();
    const encrypted = await encryptData("secret", key1);
    await expect(decryptData(encrypted, key2)).rejects.toThrow();
  });

  it("handles JSON payloads", async () => {
    const key = await generateKey();
    const data = JSON.stringify({ a: 1, b: [2, 3] });
    const encrypted = await encryptData(data, key);
    const decrypted = await decryptData(encrypted, key);
    expect(JSON.parse(decrypted)).toEqual({ a: 1, b: [2, 3] });
  });
});
