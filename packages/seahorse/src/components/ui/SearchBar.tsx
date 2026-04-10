import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Search, XCircle } from "lucide-react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
  className?: string;
}

export function SearchBar({ value, onChangeText, placeholder, right, className }: SearchBarProps) {
  return (
    <View className={className}>
      <View className="flex-row items-center bg-background-0 rounded-xl px-3.5 py-2.5 border border-outline-100">
        <Search size={18} className="text-outline-300" />
        <TextInput
          className="flex-1 ml-2.5 text-base text-typography-900"
          placeholder={placeholder}
          placeholderTextColor="rgb(211, 211, 211)"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")}>
            <XCircle size={18} className="text-outline-300" />
          </Pressable>
        )}
        {right}
      </View>
    </View>
  );
}
