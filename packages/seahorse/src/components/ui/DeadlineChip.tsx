import React from "react";
import { View, Text } from "react-native";
import { Clock, AlertCircle } from "lucide-react-native";
import { differenceInDays, differenceInMonths, isPast, isToday } from "date-fns";

interface DeadlineLabels {
  today?: string;
  overdue?: string;
  /** Short suffix for days, e.g. "d" → "5d". Default: "d". */
  days?: string;
  /** Label for months, e.g. "mo" → "2 mo". Default: "mo". */
  months?: string;
}

interface DeadlineChipProps {
  date: string;
  labels?: DeadlineLabels;
}

export function DeadlineChip({ date, labels = {} }: DeadlineChipProps) {
  const { today: todayLabel = "Today", overdue: overdueLabel = "Overdue", days: daysLabel = "d", months: monthsLabel = "mo" } = labels;

  const target = new Date(date);
  const now = new Date();
  const days = differenceInDays(target, now);
  const months = differenceInMonths(target, now);

  let label: string;
  let bgClass: string;
  let textClass: string;
  let useAlert = false;

  if (isToday(target)) {
    label = todayLabel;
    bgClass = "bg-background-error";
    textClass = "text-error-600";
    useAlert = true;
  } else if (isPast(target)) {
    label = overdueLabel;
    bgClass = "bg-background-error";
    textClass = "text-error-600";
    useAlert = true;
  } else if (days <= 7) {
    label = `${days}${daysLabel}`;
    bgClass = "bg-background-warning";
    textClass = "text-warning-600";
  } else if (days <= 30) {
    label = `${days}${daysLabel}`;
    bgClass = "bg-background-info";
    textClass = "text-info-600";
  } else {
    label = `${months} ${monthsLabel}`;
    bgClass = "bg-background-muted";
    textClass = "text-typography-500";
  }

  return (
    <View className={`flex-row items-center px-2 py-0.5 rounded-full gap-1 ${bgClass}`}>
      {useAlert ? (
        <AlertCircle size={11} className={textClass} />
      ) : (
        <Clock size={11} className={textClass} />
      )}
      <Text className={`text-xs font-medium ${textClass}`}>
        {label}
      </Text>
    </View>
  );
}
