# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

SeaHorse is a monorepo providing a generic UI component + utility library (`@drakkar.software/seahorse`) for Expo/React Native apps, along with an example Expo Router application.

**Monorepo layout:**
- `packages/seahorse/` — the published library (`@drakkar.software/seahorse`)
- `example/` — Expo Router demo app (`seahorse-example`) consuming the library via `workspace:*`
- `pnpm-workspace.yaml` — workspace definition

## Commands

All commands use pnpm. Run from the repo root unless noted.

### Library (`packages/seahorse`)
```bash
pnpm build        # tsc --build (compiles to dist/)
pnpm test         # vitest run (all tests)
pnpm typecheck    # tsc --noEmit
```

### Run a single test file
```bash
cd packages/seahorse && pnpm vitest run tests/crypto.test.ts
```

### Example app
```bash
pnpm example      # expo start (interactive)
```

## Architecture

### Build: zero bundler
The library uses `tsc --build` only — no Webpack, Rollup, or esbuild. Outputs ES2022 modules (`.js` + `.d.ts`) into `dist/`. Tree-shaking is left to consumers.

### Subpath exports
`package.json` exports every utility individually (`./utils/crypto`, `./utils/app-lock`, etc.) so consumers only bundle what they import.

### Platform abstraction pattern
Several utilities ship two code paths controlled by `Platform.OS === "web"` checks at runtime:
- `secure-store.ts` — `expo-secure-store` (native) / `localStorage` (web)
- `kv-storage.ts` — `expo-sqlite/kv-store` synchronous SQLite (native) / in-memory `Map` backed by AsyncStorage (web)
- `crypto.ts` — Web Crypto API on both platforms

### Theming
`ForgeThemeProvider` (React Context) wraps the app and accepts `{ colors: { primary, destructive } }`. Components read it via `useForgeTheme()`. Layout/structure use NativeWind `className` (Tailwind tokens like `primary-500`); interactive colors (shadows, overlays) use inline `style` props. The Tailwind preset (`./tailwind-preset`) ships zero colors — consuming apps define their own `primary` palette.

### JSX transform
`tsconfig.json` sets `"jsxImportSource": "nativewind"`, so all JSX is compiled through NativeWind's transform that enables `className` props on React Native primitives.

### Optional peer dependencies
All non-core dependencies are optional peers (see `peerDependenciesMeta` in `packages/seahorse/package.json`). Components or utilities that require an optional dep (e.g. `@gorhom/bottom-sheet` for modals, `date-fns` for date components, `expo-updates` for OTA) are silently absent if the dep isn't installed.

### Component folder structure

Source lives in `src/components/` with four semantic subfolders. The public API is fully re-exported from `src/components/index.ts` — all components are available from the single `./components` subpath export.

| Folder | Contents |
|---|---|
| `components/ui/` | 19 low-level primitives — no cross-component imports except within ui/ (HorizontalChipSelect → FilterTabs, StatusSelector → StatusBadge) |
| `components/pin/` | PinPad, LockScreen, PinSetup — all import from `../../utils/pin-helpers` and `../../utils/app-lock` |
| `components/sheets/` | ConfirmSheet, RenameSheet, DatePickerModal, TimePickerModal — all use internal `useBottomSheetModal.tsx` hook (not exported) |
| `components/form/` | FormSection.tsx with all form sub-components — imports DatePickerModal and TimePickerModal from `../sheets/` |

### Internal shared primitives

- **`src/utils/pin-helpers.ts`** — pure PIN logic (`handlePinDigit`, `handlePinDelete`). No React/RN dependency. Used by `pin/LockScreen` and `pin/PinSetup`. Re-exported as part of the public API via `pin/PinPad.tsx` and `components/index.ts`.
- **`src/components/pin/PinPad.tsx`** — shared PIN dot indicators + number grid. Used by `LockScreen` and `PinSetup`. Also exported for consumers that need a standalone PIN input.
- **`src/components/sheets/useBottomSheetModal.tsx`** — internal hook used by all four sheet/modal components. Handles present/dismiss lifecycle and `renderBackdrop`. Not part of the public API.

### Shared selection pattern

`HorizontalChipSelect` is a thin wrapper over `FilterTabs` (which is the superset). `FilterTabs` supports optional `icon?`, `count?`, and `hidden?` per tab in addition to the basic `key/label` API.

## Testing

Tests run with Vitest in a `node` environment. Only pure TypeScript utilities are tested; component rendering tests require additional setup (see below).

Test files live in `packages/seahorse/tests/*.test.ts`. When mocking React Native modules:
- `vi.mock('react-native', () => ({ Platform: { OS: 'web' } }))` controls the platform path
- `Platform.OS` is read at call-time (not import-time), so the mock object can be mutated between tests to cover both paths

**Testable component logic**: Extract pure helpers to `src/utils/` (no React imports) to make them unit-testable without React Native mocking. See `pin-helpers.ts` as the pattern.

**Component tests** are not currently set up. Adding them requires installing `react`, `react-native`, and `@testing-library/react-native` as dev dependencies, mocking NativeWind's JSX runtime, and overriding `jsxImportSource` in the test config.
