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

## Testing

Tests run with Vitest in a `node` environment. Only pure TypeScript utilities are tested; component rendering tests require additional setup (see below).

Test files live in `packages/seahorse/tests/*.test.ts`. When mocking React Native modules:
- `vi.mock('react-native', () => ({ Platform: { OS: 'web' } }))` controls the platform path
- `Platform.OS` is read at call-time (not import-time), so the mock object can be mutated between tests to cover both paths

**Component tests** are not currently set up. Adding them requires installing `react`, `react-native`, and `@testing-library/react-native` as dev dependencies, mocking NativeWind's JSX runtime, and overriding `jsxImportSource` in the test config.
