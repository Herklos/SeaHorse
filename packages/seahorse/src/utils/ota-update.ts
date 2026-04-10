import { useEffect } from "react";

interface UseAutoOtaUpdateOptions {
  /** Skip update check in dev builds. Default: true (skips in __DEV__). */
  skipInDev?: boolean;
  /** Called after a successful update fetch + reload (just before reloadAsync). */
  onUpdateApplied?: () => void;
  /** Called if the update check/fetch throws. Default: silent. */
  onError?: (err: unknown) => void;
}

/**
 * Checks for and applies an OTA update on mount (production only).
 * Requires `expo-updates` as a peer dependency.
 *
 * @example
 * // In your root layout:
 * useAutoOtaUpdate();
 */
export function useAutoOtaUpdate(options: UseAutoOtaUpdateOptions = {}): void {
  const { skipInDev = true, onUpdateApplied, onError } = options;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (skipInDev && (globalThis as any).__DEV__) return;

    (async () => {
      try {
        const Updates = await import("expo-updates");
        const { isAvailable } = await Updates.checkForUpdateAsync();
        if (isAvailable) {
          await Updates.fetchUpdateAsync();
          onUpdateApplied?.();
          await Updates.reloadAsync();
        }
      } catch (err) {
        onError?.(err);
      }
    })();
  }, []);
}
