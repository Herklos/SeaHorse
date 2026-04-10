import React, { useEffect, useCallback, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useBottomSheetModal } from "./useBottomSheetModal";

interface RenameSheetProps {
  visible: boolean;
  title: string;
  initialValue: string;
  placeholder?: string;
  saveLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function RenameSheet({
  visible,
  title,
  initialValue,
  placeholder,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: RenameSheetProps) {
  const { ref, renderBackdrop } = useBottomSheetModal(visible);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  const handleConfirm = useCallback(() => {
    if (value.trim()) onConfirm(value.trim());
  }, [value, onConfirm]);

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={onCancel}
      backgroundStyle={{ backgroundColor: "transparent" }}
      handleComponent={() => null}
    >
      <BottomSheetView>
        <View className="bg-background-0 rounded-t-3xl px-6 pt-6 pb-10">
          <View className="w-10 h-1 rounded-full bg-outline-200 self-center mb-5" />
          <Text className="text-xl font-bold text-typography-900 mb-4">{title}</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="rgb(212, 212, 212)"
            autoFocus
            style={{
              fontSize: 16,
              color: "rgb(38, 38, 39)",
              backgroundColor: "rgb(247, 249, 250)",
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "rgb(230, 230, 230)",
            }}
          />
          <View className="gap-3">
            <Pressable
              onPress={handleConfirm}
              className="py-3.5 rounded-2xl items-center bg-primary-500 active:opacity-80"
            >
              <Text className="text-white font-semibold text-base">{saveLabel}</Text>
            </Pressable>
            <Pressable
              onPress={onCancel}
              className="py-3.5 rounded-2xl items-center bg-background-900 active:opacity-80"
            >
              <Text className="text-typography-700 font-medium text-base">
                {cancelLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
