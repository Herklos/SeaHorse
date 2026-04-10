# Changelog

All notable changes to `@drakkar.software/seahorse` will be documented here.

## [0.2.0] — 2026-04-10

> **Breaking**: Requires NativeWind v5 + Tailwind CSS v4. Minimum React 19, React Native 0.83.

### Added

- **`tailwind/theme.css`** — Full semantic color token system via CSS custom properties. Consumers `@import "@drakkar.software/seahorse/tailwind-theme"` and override `:root` variables for their brand. Replaces `tailwind-preset`. Tokens: `primary/secondary/tertiary/error/success/warning/info` (0-950), `typography/outline` (0-950), `background` (0-950 + error/warning/success/muted/info), `indicator` (primary/info/error), shadows (hard-1..5, soft-1..4), font families.
- **`utils/cn`** — `cn(...inputs)` — `clsx` + `tailwind-merge` utility. Import from `@drakkar.software/seahorse/utils/cn`.
- **`FilterTabs`**: extended with `icon?`, `hidden?` props (now a superset of the old chip-only API).
- New subpath exports: `./tailwind-theme`, `./utils/cn`.
- New optional peer deps: `@expo/html-elements >=55`, `react-native-svg >=15`, `expo-haptics >=14`.

### Changed

- **All 26 components**: migrated from hardcoded `bg-gray-*`/`text-gray-*`/`dark:*` class pairs to semantic token classes (`bg-background-0`, `text-typography-900`, `border-outline-100`, etc.). Dark mode is now handled automatically by the CSS token system — no more `dark:` class duplication in components.
- `ProgressBar` budget overflow: `bg-red-500` → `bg-error-500`, `bg-amber-400` → `bg-warning-400`, `bg-emerald-400` → `bg-success-400`.
- `DeadlineChip`: converted from inline `style={{ backgroundColor, color }}` to className-based semantic tokens (`bg-background-error`, `bg-background-warning`, `bg-background-info`, `bg-background-muted`).
- `EmptyState`: default `iconBgClassName` changed from `"bg-gray-100 dark:bg-gray-800"` to `"bg-background-900"`.
- `RatingStars`: default empty star color changed from `#D1D5DB` to `rgb(221, 220, 219)` (outline-200).

### Infrastructure

- Peer dep `nativewind` bumped to `>=5.0.0`.
- New peer dep `react-native-css >=3.0.0` (required by NW v5 for `cssInterop`).
- Peer dep `react` bumped to `>=19.0.0`, `react-native` to `>=0.83.0`.
- Direct deps added: `clsx ^2.1.0`, `tailwind-merge ^3.0.0`.
- Example app: removed `tailwind.config.js`, migrated to `global.css` with TW v4 `@import` syntax.

---

## [0.1.1] — 2026-04-10

### Fixed

- Add `/// <reference types="nativewind/types" />` and ambient module stubs (`expo-sqlite/kv-store`, `expo-file-system/legacy`) to fix TypeScript build for consumers

### Internal

- Restructured into pnpm monorepo (`packages/seahorse` + `example/`)
- Added test suite: 66 tests covering `crypto`, `links`, `date`, `secure-store`, `app-lock`, `kv-storage` (web + native paths via `vi.mock`)
- Added `CLAUDE.md` for contributor guidance

---

## [0.1.0] — 2026-04-10

### Initial release

#### Components (26)

**Pure building blocks** — zero project-specific imports, only React Native + NativeWind + lucide-react-native:

- `StatusBadge` — colored label badge
- `DeleteButton` — destructive action button with confirm intent
- `SaveHeaderButton` — navigation header save button (themed via `ForgeThemeProvider`)
- `SearchBar` — text input with search icon
- `FilterTabs` — horizontal tab filter bar
- `HorizontalChipSelect` — scrollable chip selector
- `SegmentedControl` — segmented option picker
- `ProgressBar` — horizontal progress indicator
- `RatingStars` — interactive star rating
- `EmptyState` — empty list placeholder with icon, title, subtitle; accepts `iconBgClassName` + `iconColor` props
- `FAB` — floating action button with primary shadow color (themed)
- `IconCard` — pressable card with leading icon
- `StatCard` — metric card with label, value, icon
- `SectionHeader` — section heading with optional count and add button
- `CollapsibleSection` — expandable/collapsible content section
- `TimelineItem` — vertical timeline entry
- `StatusSelector` — inline status picker chips
- `ToggleCard` — labeled toggle row with primary switch color (themed)

**Parameterized components** — previously i18n-coupled, now accept string props with English defaults:

- `ConfirmSheet` — confirmation bottom sheet; `confirmLabel`, `cancelLabel` props
- `RenameSheet` — rename bottom sheet; `title`, `confirmLabel`, `cancelLabel`, `placeholder` props
- `DatePickerModal` — date picker modal; `dateLocale`, `todayLabel`, `clearLabel` props
- `TimePickerModal` — time picker modal; `confirmLabel`, `clearLabel`, `hoursLabel`, `minutesLabel` props
- `FormSection` — form building blocks:
  - `SectionTitle`, `FormCard`, `InputRow`, `ToggleRow`, `ChipSelect` — as-is
  - `DateRow` — adds `dateLocale`, `selectDateLabel`, `todayLabel`, `clearLabel` props
  - `TimeRow` — adds `selectTimeLabel`, `confirmLabel`, `clearLabel`, `hoursLabel`, `minutesLabel` props
- `DeadlineChip` — deadline countdown chip; accepts `labels: { today?, overdue?, days?, months? }` with English defaults
- `LockScreen` — PIN + biometric lock screen; accepts `labels` prop object + uses `ForgeThemeProvider` for icon color
- `PinSetup` — PIN creation/confirmation modal; accepts `labels` prop object + uses `ForgeThemeProvider` for icon color

#### Utilities (9 modules)

- `secure-store` — `secureGet`, `secureSet`, `secureDelete` (expo-secure-store)
- `kv-storage` — `initStorage`, `getStorage`, `closeStorage`, `readCollection`, `writeCollection` (expo-sqlite native / localStorage web)
- `crypto` — `generateKey`, `encryptData`, `decryptData` (AES-256-GCM via Web Crypto API)
- `app-lock` — `isLockEnabled`, `setLockEnabled`, `savePin`, `verifyPin`, `hasBiometrics`, `authenticateWithBiometrics(promptMessage?, cancelLabel?)` (expo-local-authentication + secure-store)
- `pwa-install` — `usePwaInstall` hook for PWA install prompt
- `toast` — re-exports `sonner-native` (native) / `sonner` (web)
- `file-export` — `exportToPdf`, `exportToCsv`, `exportJsonWeb`, `exportJsonNative`, `importJsonWeb`, `importJsonNative`
- `links` — `parseLinks`, `serializeLinks`, `isValidUrl`
- `date` — `safeFormat` (date-fns format wrapper with invalid date fallback)
- `ota-update` — `useAutoOtaUpdate` hook (checks + applies expo-updates OTA updates, skips in dev)

#### Theming

- **Tailwind preset** (`@drakkar.software/seahorse/tailwind-preset`) — provides structural tokens only (`borderRadius`); zero color definitions. Consumer defines their own `primary` palette.
- **`ForgeThemeProvider`** + **`useForgeTheme`** — React context for inline style colors (FAB shadow, SaveHeaderButton background, ToggleCard switch, LockScreen/PinSetup icon). Defaults to blue `#3B82F6`.

#### Build

- Single package, subpath exports (`./components`, `./utils/*`, `./theme`, `./tailwind-preset`)
- `tsc --build` → ESM `.js` + `.d.ts`, no bundler
- Zero bundled runtime dependencies; all React Native / Expo packages are optional peer dependencies
