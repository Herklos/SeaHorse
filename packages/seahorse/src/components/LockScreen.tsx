import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { Lock, Delete, Fingerprint } from "lucide-react-native";
import { verifyPin, hasBiometrics, authenticateWithBiometrics } from "../utils/app-lock";
import { useForgeTheme } from "../theme/context";

const DEFAULT_PIN_LENGTH = 4;

interface LockScreenLabels {
  title?: string;
  subtitle?: string;
  errorLabel?: string;
  biometricPromptMessage?: string;
  biometricCancelLabel?: string;
}

interface LockScreenProps {
  onUnlock: () => void;
  pinLength?: number;
  labels?: LockScreenLabels;
}

export function LockScreen({ onUnlock, pinLength = DEFAULT_PIN_LENGTH, labels = {} }: LockScreenProps) {
  const { colors } = useForgeTheme();
  const {
    title,
    subtitle = "Enter your PIN",
    errorLabel = "Incorrect PIN",
    biometricPromptMessage = "Unlock app",
    biometricCancelLabel = "Use PIN",
  } = labels;

  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    hasBiometrics().then(setBiometricAvailable);
  }, []);

  const tryBiometric = useCallback(async () => {
    const success = await authenticateWithBiometrics(biometricPromptMessage, biometricCancelLabel);
    if (success) onUnlock();
  }, [onUnlock, biometricPromptMessage, biometricCancelLabel]);

  useEffect(() => {
    if (biometricAvailable) tryBiometric();
  }, [biometricAvailable]);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= pinLength) return;
      const next = pin + digit;
      setError(false);
      if (next.length === pinLength) {
        verifyPin(next).then((ok) => {
          if (ok) {
            onUnlock();
          } else {
            setError(true);
            setPin("");
          }
        });
      } else {
        setPin(next);
      }
    },
    [pin, onUnlock, pinLength]
  );

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  }, []);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950 items-center justify-center px-8">
      <View className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900 items-center justify-center mb-6">
        <Lock size={28} color={colors.primary} />
      </View>
      {title && (
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</Text>
      )}
      <Text className="text-sm text-gray-400 mb-8">{subtitle}</Text>

      {/* PIN dots */}
      <View className="flex-row gap-4 mb-8">
        {Array.from({ length: pinLength }).map((_, i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full ${
              error
                ? "bg-red-500"
                : i < pin.length
                  ? "bg-primary-500"
                  : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
      </View>

      {error && <Text className="text-sm text-red-500 mb-4">{errorLabel}</Text>}

      {/* Number pad */}
      <View className="w-full max-w-xs">
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          [biometricAvailable ? "bio" : "", "0", "del"],
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
                    <Delete size={24} color="#9CA3AF" />
                  </Pressable>
                );
              }
              if (key === "bio") {
                return (
                  <Pressable
                    key="bio"
                    onPress={tryBiometric}
                    className="items-center justify-center"
                    style={{ width: 72, height: 72 }}
                  >
                    <Fingerprint size={24} color={colors.primary} />
                  </Pressable>
                );
              }
              return (
                <Pressable
                  key={key}
                  onPress={() => handleDigit(key)}
                  className="rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 items-center justify-center active:bg-gray-100 dark:active:bg-gray-800"
                  style={{ width: 72, height: 72 }}
                >
                  <Text className="text-2xl font-medium text-gray-900 dark:text-white">
                    {key}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
