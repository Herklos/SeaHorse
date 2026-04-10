import React from "react";
import { View, Text, Pressable } from "react-native";
import { useForgeTheme } from "../theme/context";

interface ToggleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function ToggleCard({ icon, title, subtitle, enabled, onToggle, disabled = false }: ToggleCardProps) {
  const { colors } = useForgeTheme();
  return (
    <Pressable
      onPress={!disabled ? onToggle : undefined}
      className={`bg-background-0 rounded-2xl p-4 mb-2 border border-outline-100 flex-row items-center ${
        disabled ? "opacity-50" : "active:opacity-80"
      }`}
    >
      {icon}
      <View className="ml-3 flex-1">
        <Text className="text-base text-typography-900 font-medium">{title}</Text>
        {subtitle != null && (
          <Text className="text-xs text-typography-400 mt-0.5">{subtitle}</Text>
        )}
      </View>
      <View
        className="w-12 h-7 rounded-full justify-center px-0.5"
        style={{ backgroundColor: enabled ? colors.primary : "rgb(211, 211, 211)" }}
      >
        <View
          className="w-6 h-6 rounded-full bg-white"
          style={{ alignSelf: enabled ? "flex-end" : "flex-start" }}
        />
      </View>
    </Pressable>
  );
}
