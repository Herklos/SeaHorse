import { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { safeFormat } from "@drakkar.software/seahorse/utils/date";
import { isValidUrl, parseLinks } from "@drakkar.software/seahorse/utils";
import { useAutoOtaUpdate } from "@drakkar.software/seahorse/utils/ota-update";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
      <Text className="text-sm text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-sm font-mono text-gray-900 dark:text-white">{value}</Text>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 gap-1">
      <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</Text>
      {children}
    </View>
  );
}

export default function UtilsScreen() {
  // OTA update — skips in dev builds automatically
  useAutoOtaUpdate({ skipInDev: true });

  const now = new Date();
  const invalidDate = new Date("not-a-date");

  const links = parseLinks("https://example.com, https://docs.expo.dev");

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["bottom"]}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>

        <Section title="safeFormat (date-fns wrapper)">
          <Row label="Valid date" value={safeFormat(now, "dd MMM yyyy")} />
          <Row label="With time" value={safeFormat(now, "HH:mm")} />
          <Row label="Invalid date" value={safeFormat(invalidDate, "dd MMM yyyy")} />
        </Section>

        <Section title="isValidUrl">
          <Row label="https://expo.dev" value={String(isValidUrl("https://expo.dev"))} />
          <Row label="not-a-url" value={String(isValidUrl("not-a-url"))} />
          <Row label="ftp://old.net" value={String(isValidUrl("ftp://old.net"))} />
        </Section>

        <Section title="parseLinks">
          {links.map((link, i) => (
            <Row key={i} label={`Link ${i + 1}`} value={link.url} />
          ))}
        </Section>

        <Section title="useAutoOtaUpdate">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            OTA update check runs on mount in production builds. Skipped in dev mode ({__DEV__ ? "active" : "inactive"}).
          </Text>
        </Section>

      </ScrollView>
    </SafeAreaView>
  );
}
