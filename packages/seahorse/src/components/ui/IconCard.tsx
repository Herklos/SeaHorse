import React from "react";
import { View, Text, Pressable } from "react-native-css/components";

interface IconCardProps {
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function IconCard({ icon: Icon, title, subtitle, right, onPress, children, className }: IconCardProps) {
  const content = (
    <>
      <View className="flex-row items-center">
        <Icon size={20} className="text-typography-500" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-typography-900">
            {title}
          </Text>
          {subtitle != null && (
            <Text className="text-xs text-typography-400 mt-0.5">{subtitle}</Text>
          )}
        </View>
        {right}
      </View>
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`bg-background-0 rounded-2xl p-4 mb-3 border border-outline-100 active:opacity-80 ${className ?? ""}`}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={`bg-background-0 rounded-2xl p-4 mb-3 border border-outline-100 ${className ?? ""}`}>
      {content}
    </View>
  );
}
