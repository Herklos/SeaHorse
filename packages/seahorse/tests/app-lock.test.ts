import { vi, describe, it, expect, beforeEach } from "vitest";

// vi.mock is hoisted — use vi.hoisted() for variables referenced in factories
const platform = vi.hoisted(() => ({ OS: "web" }));
vi.mock("react-native", () => ({ Platform: platform }));

const mockSecure = vi.hoisted(() => ({
  secureGet: vi.fn<[string], Promise<string | null>>(),
  secureSet: vi.fn<[string, string], Promise<void>>(),
  secureDelete: vi.fn<[string], Promise<void>>(),
}));
vi.mock("../src/utils/secure-store", () => mockSecure);

const mockLocalAuth = vi.hoisted(() => ({
  hasHardwareAsync: vi.fn<[], Promise<boolean>>(),
  isEnrolledAsync: vi.fn<[], Promise<boolean>>(),
  authenticateAsync: vi.fn<[object], Promise<{ success: boolean }>>(),
}));
vi.mock("expo-local-authentication", () => mockLocalAuth);

import {
  isLockEnabled,
  setLockEnabled,
  savePin,
  verifyPin,
  hasBiometrics,
  authenticateWithBiometrics,
} from "../src/utils/app-lock";

describe("isLockEnabled", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns true when secure store has '1'", async () => {
    mockSecure.secureGet.mockResolvedValue("1");
    expect(await isLockEnabled()).toBe(true);
  });

  it("returns false when secure store has null", async () => {
    mockSecure.secureGet.mockResolvedValue(null);
    expect(await isLockEnabled()).toBe(false);
  });

  it("returns false when secure store has any other value", async () => {
    mockSecure.secureGet.mockResolvedValue("0");
    expect(await isLockEnabled()).toBe(false);
  });
});

describe("setLockEnabled", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets '1' in secure store when enabled", async () => {
    await setLockEnabled(true);
    expect(mockSecure.secureSet).toHaveBeenCalledWith("app_lock_enabled", "1");
    expect(mockSecure.secureDelete).not.toHaveBeenCalled();
  });

  it("deletes both keys when disabled", async () => {
    mockSecure.secureDelete.mockResolvedValue(undefined);
    await setLockEnabled(false);
    expect(mockSecure.secureDelete).toHaveBeenCalledWith("app_lock_enabled");
    expect(mockSecure.secureDelete).toHaveBeenCalledWith("app_lock_pin");
  });
});

describe("savePin / verifyPin", () => {
  beforeEach(() => vi.clearAllMocks());

  it("savePin stores the pin in secure store", async () => {
    mockSecure.secureSet.mockResolvedValue(undefined);
    await savePin("1234");
    expect(mockSecure.secureSet).toHaveBeenCalledWith("app_lock_pin", "1234");
  });

  it("verifyPin returns true when pin matches stored value", async () => {
    mockSecure.secureGet.mockResolvedValue("1234");
    expect(await verifyPin("1234")).toBe(true);
  });

  it("verifyPin returns false when pin does not match", async () => {
    mockSecure.secureGet.mockResolvedValue("1234");
    expect(await verifyPin("0000")).toBe(false);
  });

  it("verifyPin returns false when no pin is stored", async () => {
    mockSecure.secureGet.mockResolvedValue(null);
    expect(await verifyPin("1234")).toBe(false);
  });
});

describe("hasBiometrics — web platform", () => {
  beforeEach(() => {
    platform.OS = "web";
    vi.clearAllMocks();
  });

  it("returns false on web without calling LocalAuthentication", async () => {
    expect(await hasBiometrics()).toBe(false);
    expect(mockLocalAuth.hasHardwareAsync).not.toHaveBeenCalled();
  });
});

describe("hasBiometrics — native platform", () => {
  beforeEach(() => {
    platform.OS = "ios";
    vi.clearAllMocks();
  });

  it("returns true when hardware present and enrolled", async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(true);
    expect(await hasBiometrics()).toBe(true);
  });

  it("returns false when hardware not compatible", async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(false);
    expect(await hasBiometrics()).toBe(false);
    expect(mockLocalAuth.isEnrolledAsync).not.toHaveBeenCalled();
  });

  it("returns false when hardware present but nothing enrolled", async () => {
    mockLocalAuth.hasHardwareAsync.mockResolvedValue(true);
    mockLocalAuth.isEnrolledAsync.mockResolvedValue(false);
    expect(await hasBiometrics()).toBe(false);
  });
});

describe("authenticateWithBiometrics — web platform", () => {
  beforeEach(() => {
    platform.OS = "web";
    vi.clearAllMocks();
  });

  it("returns false on web without calling LocalAuthentication", async () => {
    expect(await authenticateWithBiometrics()).toBe(false);
    expect(mockLocalAuth.authenticateAsync).not.toHaveBeenCalled();
  });
});

describe("authenticateWithBiometrics — native platform", () => {
  beforeEach(() => {
    platform.OS = "ios";
    vi.clearAllMocks();
  });

  it("returns true on successful biometric auth", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });
    expect(await authenticateWithBiometrics()).toBe(true);
  });

  it("returns false on failed biometric auth", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: false });
    expect(await authenticateWithBiometrics()).toBe(false);
  });

  it("passes custom promptMessage and cancelLabel", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });
    await authenticateWithBiometrics("Open app", "Enter PIN");
    expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ promptMessage: "Open app", cancelLabel: "Enter PIN" }),
    );
  });

  it("uses default prompt strings when not provided", async () => {
    mockLocalAuth.authenticateAsync.mockResolvedValue({ success: true });
    await authenticateWithBiometrics();
    expect(mockLocalAuth.authenticateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ promptMessage: "Unlock app", cancelLabel: "Use PIN" }),
    );
  });
});
