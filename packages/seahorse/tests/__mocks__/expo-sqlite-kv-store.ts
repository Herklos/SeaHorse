/** Stub for expo-sqlite/kv-store — replaced by vi.mock() in test files */
export class SQLiteStorage {
  constructor(_databaseName?: string) {}
  getItemSync(_key: string): string | null { return null; }
  setItemSync(_key: string, _value: string): void {}
  removeItemSync(_key: string): void {}
  getAllKeysSync(): string[] { return []; }
  closeSync(): void {}
}
