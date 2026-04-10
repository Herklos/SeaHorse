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
  let bg: string;
  let fg: string;
  let useAlert = false;

  if (isToday(target)) {
    label = todayLabel;
    bg = "#FEF2F2";
    fg = "#DC2626";
    useAlert = true;
  } else if (isPast(target)) {
    label = overdueLabel;
    bg = "#FEF2F2";
    fg = "#DC2626";
    useAlert = true;
  } else if (days <= 7) {
    label = `${days}${daysLabel}`;
    bg = "#FFFBEB";
    fg = "#D97706";
  } else if (days <= 30) {
    label = `${days}${daysLabel}`;
    bg = "#EFF6FF";
    fg = "#2563EB";
  } else {
    label = `${months} ${monthsLabel}`;
    bg = "#F3F4F6";
    fg = "#6B7280";
  }

  return (
    <View
      className="flex-row items-center px-2 py-0.5 rounded-full gap-1"
      style={{ backgroundColor: bg }}
    >
      {useAlert ? (
        <AlertCircle size={11} color={fg} />
      ) : (
        <Clock size={11} color={fg} />
      )}
      <Text className="text-xs font-medium" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}
