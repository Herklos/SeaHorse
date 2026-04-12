/// <reference types="nativewind/types" />

// Simple stubs for optional peer dependencies not installed in devDeps.
// Imports from these resolve to `any`; consumers have the real packages.
declare module "expo-haptics";
declare module "expo-secure-store";
declare module "expo-local-authentication";
declare module "expo-file-system";
declare module "expo-document-picker";
declare module "expo-print";
declare module "expo-sharing";
declare module "expo-sqlite";
declare module "expo-updates";
declare module "@expo/html-elements";
// react-native-svg: SvgProps must extend ViewProps so NativeWind's className
// augmentation flows through to LucideProps (which extends SvgProps).
declare module "react-native-svg" {
  import type { ViewProps } from "react-native";
  import type { ComponentType } from "react";
  export interface SvgProps extends ViewProps {
    color?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number | string;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel";
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    d?: string;
  }
  export const Svg: ComponentType<SvgProps>;
  export const Path: ComponentType<SvgProps>;
}

// @gorhom/bottom-sheet: extends Component<any> so it works as JSX and as a
// type in useRef<BottomSheetModal>.
declare module "@gorhom/bottom-sheet" {
  import type { Component, ComponentType } from "react";
  import type { ViewProps } from "react-native";
  export class BottomSheetModal extends Component<any> {
    present(): void;
    dismiss(): void;
  }
  export const BottomSheetView: ComponentType<ViewProps & { className?: string }>;
  export const BottomSheetBackdrop: ComponentType<any>;
}

declare module "@react-native-async-storage/async-storage";
declare module "sonner";
declare module "sonner-native";

// Subpath stubs for peer deps whose package exports don't include these paths
declare module "expo-file-system/legacy" {
  export const cacheDirectory: string | null;
  export enum EncodingType {
    UTF8 = "utf8",
    Base64 = "base64",
  }
  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: EncodingType },
  ): Promise<void>;
  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: EncodingType },
  ): Promise<string>;
}

declare module "expo-sqlite/kv-store" {
  export class SQLiteStorage {
    constructor(databaseName?: string);
    getItemSync(key: string): string | null;
    setItemSync(key: string, value: string): void;
    removeItemSync(key: string): void;
    getAllKeysSync(): string[];
    closeSync(): void;
  }
}
