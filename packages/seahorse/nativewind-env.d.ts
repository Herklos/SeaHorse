/// <reference types="nativewind/types" />

// Ambient stubs for optional peer dependency subpaths not resolvable at build time
declare module "expo-file-system/legacy" {
  export const cacheDirectory: string | null;
  export enum EncodingType {
    UTF8 = "utf8",
    Base64 = "base64",
  }
  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: EncodingType },
  ): Promise<void>;
  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType },
  ): Promise<string>;
}

declare module "expo-sqlite/kv-store" {
  export class SQLiteStorage {
    constructor(databaseName?: string);
    getItemSync(key: string): string | null;
    setItemSync(key: string, value: string): void;
    removeItemSync(key: string): void;
    getAllKeysSync(): string[];
    closeSync(): void;
  }
}
