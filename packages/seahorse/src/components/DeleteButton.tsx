import React from "react";
import { Pressable, Text } from "react-native";

interface DeleteButtonProps {
  label: string;
  onPress: () => void;
}

export function DeleteButton({ label, onPress }: DeleteButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-background-error rounded-2xl p-4 mb-8 items-center border border-error-100"
    >
      <Text className="text-error-500 font-semibold text-sm">{label}</Text>
    </Pressable>
  );
}
