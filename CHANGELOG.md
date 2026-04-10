# Changelog

All notable changes to `@drakkar.software/seahorse` will be documented here.

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
