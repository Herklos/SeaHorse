<p align="center">
  <img src="./logo.png" alt="SeaHorse" width="200" />
</p>

# SeaHorse

Generic UI components and utilities for React Native / Expo apps.

**27 components** · **10 utility modules** · **Zero domain coupling** · **NativeWind v5 + Tailwind CSS v4**

---

## Requirements

- React 19+, React Native 0.83+
- NativeWind v5 (`^5.0.0-preview.3`)
- Tailwind CSS v4 (`^4.2.0`)
- `react-native-css ^3.0.6`

---

## Install

```bash
pnpm add @drakkar.software/seahorse
```

In your app's `global.css`, import the SeaHorse theme **before** your own brand overrides:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";

/* SeaHorse semantic token defaults */
@import "@drakkar.software/seahorse/tailwind-theme";

/* Override with your brand colors */
@layer theme {
  :root {
    --color-primary-500: 236 72 153;   /* pink-500 */
    --color-secondary-500: 71 85 105;  /* slate-500 */
  }
  :root.dark {
    --color-primary-500: 244 114 182;  /* pink-400 */
  }
}
```

> Token values are **RGB triplets** (no `rgb()` wrapper) so Tailwind's opacity modifiers (`bg-primary-500/50`) work correctly.

Add `@source` directives pointing at your app files so Tailwind scans for class names.

---

## Theme (inline style colors)

A few components use inline `style={}` for shadow and toggle colors. Wrap your app in `ForgeThemeProvider` to set them:

```tsx
import { ForgeThemeProvider } from "@drakkar.software/seahorse/theme";

export default function RootLayout() {
  return (
    <ForgeThemeProvider theme={{ colors: { primary: "#EC4899" } }}>
      {/* your app */}
    </ForgeThemeProvider>
  );
}
```

Without a provider the components default to blue `#3B82F6`.

---

## Components

Import from `@drakkar.software/seahorse/components` (or the root barrel):

```tsx
import {
  SearchBar, FilterTabs, FAB, EmptyState, ConfirmSheet,
  FormCard, InputRow, DateRow, TimeRow, ToggleRow, ChipSelect,
} from "@drakkar.software/seahorse/components";
```

Source is organized into four subfolders — the public API is unchanged:

| Folder | Contents |
|---|---|
| `components/ui/` | Low-level primitives: StatusBadge, SearchBar, FilterTabs, FAB, ProgressBar, … |
| `components/pin/` | PIN auth: PinPad, LockScreen, PinSetup |
| `components/sheets/` | Bottom-sheet modals: ConfirmSheet, RenameSheet, DatePickerModal, TimePickerModal |
| `components/form/` | Form building blocks: SectionTitle, FormCard, InputRow, DateRow, TimeRow, ToggleRow, ChipSelect |

### Building blocks

| Component | Description |
|---|---|
| `StatusBadge` | Colored pill badge (label + hex color) |
| `DeleteButton` | Red destructive action button |
| `SaveHeaderButton` | Header pill button with enabled/disabled state |
| `SearchBar` | Text input with search icon and clear button |
| `FilterTabs` | Horizontal scrolling filter chips with optional counts |
| `HorizontalChipSelect` | Horizontal single-select chips |
| `SegmentedControl` | iOS-style segmented control with pill indicator |
| `ProgressBar` | Progress bar with optional budget color thresholds |
| `RatingStars` | Interactive/read-only 5-star rating |
| `EmptyState` | Full-screen empty state with icon, title, description, CTA |
| `FAB` | Floating action button (bottom-right) |
| `IconCard` | Card with icon, title, subtitle, optional children |
| `StatCard` | Dashboard stat card with value/unit/total |
| `SectionHeader` | Sticky section header with right slot |
| `CollapsibleSection` | Expand/collapse section with chevron |
| `TimelineItem` | Timeline row with connector line |
| `StatusSelector` | Horizontal scrolling status badge picker |
| `ToggleCard` | Settings toggle card with custom switch |
| `PinPad` | PIN dot indicators + number grid (used by `LockScreen`/`PinSetup`, also standalone) |

### Form components (`FormSection`)

```tsx
import { SectionTitle, FormCard, InputRow, DateRow, TimeRow, ToggleRow, ChipSelect }
  from "@drakkar.software/seahorse/components";
import { fr } from "date-fns/locale";

<FormCard>
  <SectionTitle>Details</SectionTitle>
  <InputRow label="Name" value={name} onChangeText={setName} />
  <DateRow label="Date" value={date} onChange={setDate} dateLocale={fr} />
  <TimeRow label="Time" value={time} onChange={setTime} />
  <ToggleRow label="Public" value={isPublic} onToggle={toggle} />
  <ChipSelect options={["a","b"]} value={val} onChange={setVal} labels={{ a: "Option A", b: "Option B" }} />
</FormCard>
```

### Modal components

Require `@gorhom/bottom-sheet` as a peer dep.

| Component | Key props |
|---|---|
| `ConfirmSheet` | `confirmLabel`, `cancelLabel`, `destructive` |
| `RenameSheet` | `saveLabel`, `cancelLabel` |
| `DatePickerModal` | `dateLocale`, `todayLabel`, `clearLabel` |
| `TimePickerModal` | `confirmLabel`, `clearLabel`, `hoursLabel`, `minutesLabel` |

### `DeadlineChip`

```tsx
<DeadlineChip date="2025-12-31" labels={{ today: "Today", overdue: "Overdue", days: "d", months: "mo" }} />
```

---

## Utilities

### `secure-store`

```ts
import { secureGet, secureSet, secureDelete } from "@drakkar.software/seahorse/utils/secure-store";
```

Cross-platform: `expo-secure-store` on native, `localStorage` on web.

### `kv-storage`

```ts
import { initStorage, readCollection, writeCollection } from "@drakkar.software/seahorse/utils/kv-storage";
```

Typed JSON KV storage. `expo-sqlite/kv-store` on native (synchronous), AsyncStorage-backed in-memory cache on web.

### `crypto`

```ts
import { generateKey, encryptData, decryptData } from "@drakkar.software/seahorse/utils/crypto";
```

AES-256-GCM via Web Crypto API. Zero dependencies.

### `app-lock`

```ts
import { isLockEnabled, setLockEnabled, savePin, verifyPin, hasBiometrics, authenticateWithBiometrics }
  from "@drakkar.software/seahorse/utils/app-lock";

await authenticateWithBiometrics("Unlock MyApp", "Use PIN");
```

PIN stored in SecureStore. Biometric via `expo-local-authentication`.

### `pwa-install`

```ts
import { usePwaInstall } from "@drakkar.software/seahorse/utils/pwa-install";

const { canInstall, install, isIosSafari, dismissIosBanner } = usePwaInstall();
```

Chromium `beforeinstallprompt` + iOS Safari detection.

### `toast`

```ts
import { toast, Toaster } from "@drakkar.software/seahorse/utils/toast";
```

Platform-split re-export: `sonner-native` on native, `sonner` on web.

### `file-export`

```ts
import { exportToPdf, exportToCsv, exportJsonWeb, exportJsonNative, importJsonWeb, importJsonNative }
  from "@drakkar.software/seahorse/utils/file-export";
```

Cross-platform PDF/CSV/JSON export and JSON import.

### `links`

```ts
import { parseLinks, serializeLinks, isValidUrl } from "@drakkar.software/seahorse/utils/links";
```

Parse/serialize URL arrays stored as a single JSON string field.

---

## Peer dependencies

| Dependency | Used by |
|---|---|
| Dependency | Used by |
|---|---|
| `react >=19`, `react-native >=0.83`, `nativewind >=5`, `lucide-react-native` | All components |
| `react-native-css >=3` | Heading, Spinner, Switch (cssInterop) |
| `@gorhom/bottom-sheet >=5` | ConfirmSheet, RenameSheet, DatePickerModal, TimePickerModal |
| `date-fns >=3` | DatePickerModal, DeadlineChip, FormSection DateRow |
| `expo-secure-store >=13` | secure-store, app-lock |
| `expo-local-authentication >=14` | app-lock |
| `expo-sqlite >=14` | kv-storage (native) |
| `@react-native-async-storage/async-storage >=2` | kv-storage (web) |
| `expo-file-system >=17`, `expo-sharing >=12`, `expo-print >=13`, `expo-document-picker >=12` | file-export |
| `sonner >=2`, `sonner-native >=0.20` | toast |
| `expo-updates >=0.25` | ota-update |
| `@expo/html-elements >=55` | Heading primitive |
| `react-native-svg >=15` | Checkbox primitive |
| `expo-haptics >=14` | haptics utility |

All optional except `react`, `react-native`, `nativewind`, `lucide-react-native`.

### `cn` utility

```ts
import { cn } from "@drakkar.software/seahorse/utils/cn";

<View className={cn("p-4", isActive && "bg-primary-500")} />
```

`clsx` + `tailwind-merge` — bundled as a direct dependency.

### PIN helpers

Pure TypeScript utilities (no React dependency) exported alongside `PinPad`:

```ts
import { handlePinDigit, handlePinDelete } from "@drakkar.software/seahorse/components";

const { nextPin, isComplete } = handlePinDigit(currentPin, "5", 4);
const trimmed = handlePinDelete(currentPin);
```

Useful for building custom PIN flows without the full `PinPad` UI.

---

## License

MIT
