<p align="center">
  <img src="./logo.png" alt="SeaHorse" width="200" />
</p>

# SeaHorse

Generic UI components and utilities for React Native / Expo apps.

**24 components** · **7 utility modules** · **Zero domain coupling** · **NativeWind v4**

---

## Install

```bash
pnpm add @drakkar.software/seahorse
```

Add the Tailwind preset to your `tailwind.config.js`:

```js
module.exports = {
  presets: [require("nativewind/preset"), require("@drakkar.software/seahorse/tailwind-preset")],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    // include SeaHorse components so Tailwind sees the class names
    "./node_modules/@drakkar.software/seahorse/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your own brand color — SeaHorse components use primary-* tokens
        primary: {
          50:  "#fdf2f8",
          100: "#fce7f3",
          // ...
          500: "#ec4899",
          600: "#db2777",
          // ...
        },
      },
    },
  },
};
```

> The SeaHorse preset ships **no colors**. You define `primary` to match your brand.

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
| `react`, `react-native`, `nativewind`, `lucide-react-native` | All components |
| `@gorhom/bottom-sheet` | ConfirmSheet, RenameSheet, DatePickerModal, TimePickerModal |
| `date-fns` | DatePickerModal, DeadlineChip, FormSection DateRow |
| `expo-secure-store` | secure-store, app-lock |
| `expo-local-authentication` | app-lock |
| `expo-sqlite` | kv-storage (native) |
| `@react-native-async-storage/async-storage` | kv-storage (web) |
| `expo-file-system`, `expo-sharing`, `expo-print`, `expo-document-picker` | file-export |
| `sonner`, `sonner-native` | toast |

All optional except `react`, `react-native`, `nativewind`, `lucide-react-native`.

---

## License

MIT
