import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const sections = [
  {
    title: "Components",
    description: "UI building blocks: badges, cards, search, FAB, timeline…",
    route: "/components" as const,
  },
  {
    title: "Form Elements",
    description: "FormSection, InputRow, DateRow, ToggleRow, ChipSelect…",
    route: "/forms" as const,
  },
  {
    title: "Utilities",
    description: "safeFormat, secure-store, crypto, app-lock, OTA update…",
    route: "/utils" as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={["bottom"]}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 12 }}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          SeaHorse
        </Text>
        <Text className="text-base text-gray-500 dark:text-gray-400 mb-4">
          Generic UI components and utilities for React Native / Expo apps.
        </Text>

        {sections.map((section) => (
          <TouchableOpacity
            key={section.route}
            onPress={() => router.push(section.route)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {section.title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {section.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
