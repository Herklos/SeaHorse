import React, { useState, useCallback } from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Lock, Delete, X } from "lucide-react-native";
import { savePin, setLockEnabled } from "../utils/app-lock";
import { useForgeTheme } from "../theme/context";

const DEFAULT_PIN_LENGTH = 4;

interface PinSetupLabels {
  createTitle?: string;
  confirmTitle?: string;
  createSubtitle?: string;
  confirmSubtitle?: string;
  mismatchError?: string;
}

interface PinSetupProps {
  visible: boolean;
  onComplete: () => void;
  onCancel: () => void;
  pinLength?: number;
  labels?: PinSetupLabels;
}

export function PinSetup({
  visible,
  onComplete,
  onCancel,
  pinLength = DEFAULT_PIN_LENGTH,
  labels = {},
}: PinSetupProps) {
  const { colors } = useForgeTheme();
  const {
    createTitle = "Create a PIN",
    confirmTitle = "Confirm your PIN",
    createSubtitle = `Choose a ${pinLength}-digit code`,
    confirmSubtitle = "Enter the same code to confirm",
    mismatchError = "Codes do not match",
  } = labels;

  const [step, setStep] = useState<"create" | "confirm">("create");
  const [firstPin, setFirstPin] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const reset = useCallback(() => {
    setStep("create");
    setFirstPin("");
    setPin("");
    setError(false);
  }, []);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= pinLength) return;
      const next = pin + digit;
      setError(false);
      if (next.length === pinLength) {
        if (step === "create") {
          setFirstPin(next);
          setPin("");
          setStep("confirm");
        } else {
          if (next === firstPin) {
            savePin(next).then(() =>
              setLockEnabled(true).then(() => {
                reset();
                onComplete();
              })
            );
          } else {
            setError(true);
            setPin("");
          }
        }
      } else {
        setPin(next);
      }
    },
    [pin, step, firstPin, onComplete, reset, pinLength]
  );

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }, []);

  const handleCancel = useCallback(() => {
    reset();
    onCancel();
  }, [onCancel, reset]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View className="flex-1 bg-background-0 items-center justify-center px-8">
        <Pressable
          onPress={handleCancel}
          className="absolute top-14 right-6 w-10 h-10 items-center justify-center"
        >
          <X size={24} className="text-typography-400" />
        </Pressable>

        <View className="w-14 h-14 rounded-2xl bg-primary-50 items-center justify-center mb-6">
          <Lock size={28} color={colors.primary} />
        </View>
        <Text className="text-xl font-bold text-typography-900 mb-2">
          {step === "create" ? createTitle : confirmTitle}
        </Text>
        <Text className="text-sm text-typography-400 mb-8">
          {step === "create" ? createSubtitle : confirmSubtitle}
        </Text>

        {/* PIN dots */}
        <View className="flex-row gap-4 mb-8">
          {Array.from({ length: pinLength }).map((_, i) => (
            <View
              key={i}
              className={`w-4 h-4 rounded-full ${
                error
                  ? "bg-error-500"
                  : i < pin.length
                    ? "bg-primary-500"
                    : "bg-outline-200"
              }`}
            />
          ))}
        </View>

        {error && <Text className="text-sm text-error-500 mb-4">{mismatchError}</Text>}

        {/* Number pad */}
        <View className="w-full max-w-xs">
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["", "0", "del"],
          ].map((row, ri) => (
            <View key={ri} className="flex-row justify-center gap-6 mb-4">
              {row.map((key) => {
                if (key === "") {
                  return <View key="empty" style={{ width: 72, height: 72 }} />;
                }
                if (key === "del") {
                  return (
                    <Pressable
                      key="del"
                      onPress={handleDelete}
                      className="items-center justify-center"
                      style={{ width: 72, height: 72 }}
                    >
                      <Delete size={24} className="text-typography-400" />
                    </Pressable>
                  );
                }
                return (
                  <Pressable
                    key={key}
                    onPress={() => handleDigit(key)}
                    className="rounded-full bg-background-0 border border-outline-100 items-center justify-center active:bg-background-900"
                    style={{ width: 72, height: 72 }}
                  >
                    <Text className="text-2xl font-medium text-typography-900">
                      {key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}
