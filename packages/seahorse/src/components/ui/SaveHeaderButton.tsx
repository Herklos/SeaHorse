import React from "react";
import { Pressable, Text } from "react-native";
import { useForgeTheme } from "../../theme/context";

interface SaveHeaderButtonProps {
  label: string;
  enabled: boolean;
  onPress: () => void;
}

export function SaveHeaderButton({ label, enabled, onPress }: SaveHeaderButtonProps) {
  const { colors } = useForgeTheme();
  return (
    <Pressable
      onPress={enabled ? onPress : undefined}
      style={{
        marginRight: 8,
        backgroundColor: enabled ? colors.primary : "rgb(163, 163, 163)",
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 6,
        opacity: enabled ? 1 : 0.4,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
        {label}
      </Text>
    </Pressable>
  );
}
