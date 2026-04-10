<p align="center">
  <img src="./logo.png" alt="SeaHorse" width="200" />
</p>

# SeaHorse

Generic UI components and utilities for React Native / Expo apps.

**30 components** · **10 utility modules** · **Zero domain coupling** · **NativeWind v5 + Tailwind CSS v4**

---

## Requirements

- React 19+, React Native 0.83+
- NativeWind v5 (`^5.0.0-preview.3`)
- Tailwind CSS v4 (`^4.2.0`)
- `react-native-css ^3.0.6`

---

## Expo app setup (NativeWind v5 / Tailwind v4)

NativeWind v5 is in alpha. Several config quirks are required. Follow each step.

### 1. Install dependencies

```bash
npx expo install nativewind@^5.0.0-preview.3 react-native-css@^3.0.6 \
  react-native-web tailwindcss @tailwindcss/postcss
```

> `react-native-web` is required by `expo-router` even for native-only apps.  
> `tailwindcss` and `@tailwindcss/postcss` drive the v4 CSS pipeline.

### 2. `babel.config.js`

Do **not** add `nativewind/babel` or `jsxImportSource: "nativewind"` — NativeWind v5 removed the Babel plugin. Use the plain Expo preset:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { unstable_transformImportMeta: true }]],
  };
};
```

### 3. `metro.config.js`

Use lowercase `withNativewind` (no arguments). Add three resolver redirects to handle NW v5 preview.3 gaps on web:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = originalResolveRequest ?? context.resolveRequest;

  // NW v5 preview dropped jsx-runtime shims; expo-router still imports them.
  if (moduleName === "nativewind/jsx-runtime")
    return resolve(context, "react/jsx-runtime", platform);
  if (moduleName === "nativewind/jsx-dev-runtime")
    return resolve(context, "react/jsx-dev-runtime", platform);

  // react-native-css/components uses cssInterop which fails on web.
  // On web NativeWind handles className via real CSS — bypass cssInterop.
  if (platform === "web" && moduleName === "react-native-css/components")
    return resolve(context, "react-native", platform);

  // Fix @babel/runtime ESM crash on web.
  if (platform === "web" && moduleName.startsWith("@babel/runtime/helpers/esm/"))
    return resolve(context, moduleName.replace("@babel/runtime/helpers/esm/", "@babel/runtime/helpers/"), platform);

  return resolve(context, moduleName, platform);
};

module.exports = withNativewind(config);
```

### 4. `postcss.config.mjs`

Required for Tailwind CSS v4:

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

### 5. `app.json`

Set web output to `"single"` (SPA mode). The `"static"` SSR mode triggers bundling errors with NW v5:

```json
{
  "expo": {
    "web": { "bundler": "metro", "output": "single" }
  }
}
```

### 6. `pnpm` lightningcss override (pnpm only)

If you use pnpm, pin `lightningcss` to avoid peer conflicts:

```json
{
  "pnpm": {
    "overrides": { "lightningcss": "1.30.1" }
  }
}
```

### 7. React version (if using `react-native-web`)

`react-native-web` pulls in `react-dom`. Pin `react` to the same version to avoid peer mismatch warnings:

```json
{
  "dependencies": {
    "react": "19.2.5",
    "react-dom": "19.2.5"
  }
}
```

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

## App root setup

Wrap your root layout with the required providers. `BottomSheetModalProvider` is needed for all sheet/modal components; it must be inside `GestureHandlerRootView`:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ForgeThemeProvider } from "@drakkar.software/seahorse/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ForgeThemeProvider theme={{ colors: { primary: "#EC4899" } }}>
        <BottomSheetModalProvider>
          {/* your app / Stack / Tabs */}
        </BottomSheetModalProvider>
      </ForgeThemeProvider>
    </GestureHandlerRootView>
  );
}
```

Without `BottomSheetModalProvider`: runtime crash `'BottomSheetModalInternalContext' cannot be null`.  
Without `ForgeThemeProvider`: inline-style colors (shadows, toggles) default to blue `#3B82F6`.

---

## Components

### Primitives

Import from `@drakkar.software/seahorse/primitives`:

```tsx
import { Box, Text, Button, FlashList, ImageBackground } from "@drakkar.software/seahorse/primitives";
```

| Component | Description |
|---|---|
| `FlashList` | High-performance list wrapping `@legendapp/list`. Accepts `FlatListProps<T>` + `estimatedItemSize`. Requires `@legendapp/list` peer. |
| `ImageBackground` | Platform-split image background. Native: RN `ImageBackground` with `className`. Web: `div` with CSS `backgroundImage`. Props: `source`, `className`, `style`. |
| `Section` | Semantic `<section>` element. Native: `@expo/html-elements` with `cssInterop`. Web: real `<section>` tag. Props: `ViewProps` + `className`. |
| `Nav` | Semantic `<nav>` element. Native: `@expo/html-elements` with `cssInterop`. Web: real `<nav>` tag. Props: `ViewProps` + `className`. |
| `Footer` | Semantic `<footer>` element. Native: `@expo/html-elements` with `cssInterop`. Web: real `<footer>` tag. Props: `ViewProps` + `className`. |
| `Main` | Semantic `<main>` element. Native: `@expo/html-elements` with `cssInterop`. Web: real `<main>` tag. Props: `ViewProps` + `className`. |
| `Anchor` | Pressable link. Native: `Pressable` + `Linking.openURL(href)`. Web: real `<a>` tag. Props: `PressableProps` + `href?`, `className`. |

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
| `components/ui/` | Low-level primitives: BackButton, StatusBadge, SearchBar, FilterTabs, FAB, ProgressBar, … |
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
| `BackButton` | Ghost button with left arrow icon. Props: `text`, `onPress`, optional `className` |
| `PinPad` | PIN dot indicators + number grid (used by `LockScreen`/`PinSetup`, also standalone) |
| `FeatureCard` | Icon + title + description card with optional CTA. Props: `icon` (ReactNode), `title`, `description`, `ctaLabel?`, `onCtaPress?`, `className?` |

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

### `use-page-meta`

```ts
import { usePageMeta } from "@drakkar.software/seahorse/utils/use-page-meta";

usePageMeta({
  title: "My Page",
  description: "Page description for SEO",
  canonical: "https://example.com/my-page",
  ogImage: "https://example.com/og.png",
  hreflang: [{ lang: "fr", href: "https://example.com/fr/my-page" }],
});
```

Sets per-page SEO meta tags on web (no-op on native). Manages `document.title`, `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:type`, `og:image`), Twitter Card tags, `<link rel="canonical">`, and `hreflang` alternate links.

---

## Peer dependencies

| Dependency | Used by |
|---|---|
| `react >=19`, `react-native >=0.83`, `nativewind >=5`, `lucide-react-native` | All components |
| `react-native-css >=3` | All visual primitives — `View`, `Text`, `Pressable`, `ScrollView`, `TextInput`, `ActivityIndicator`, `Switch`, `FlatList`, `VirtualizedList` are imported from `react-native-css/components` |
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
| `@legendapp/list >=1` | FlashList primitive |

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
