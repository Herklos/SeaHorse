import { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  SectionTitle,
  FormCard,
  InputRow,
  DateRow,
  TimeRow,
  ToggleRow,
  ChipSelect,
} from "@drakkar.software/seahorse/components";

const CATEGORY_OPTIONS = [
  { value: "venue", label: "Venue" },
  { value: "catering", label: "Catering" },
  { value: "music", label: "Music" },
  { value: "photo", label: "Photography" },
];

export default function FormsScreen() {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["bottom"]}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 16 }}>
        <SectionTitle title="Vendor Details" />
        <FormCard>
          <InputRow label="Name" value={name} onChangeText={setName} placeholder="Enter vendor name" />
          <InputRow
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes"
            multiline
          />
          <DateRow
            label="Event date"
            value={date}
            onChange={setDate}
            selectDateLabel="Pick a date"
            todayLabel="Today"
            clearLabel="Clear"
          />
          <TimeRow
            label="Start time"
            value={time}
            onChange={setTime}
            selectTimeLabel="Pick a time"
            confirmLabel="Confirm"
            clearLabel="Clear"
          />
          <ToggleRow
            label="Confirmed"
            value={confirmed}
            onChange={setConfirmed}
          />
        </FormCard>

        <SectionTitle title="Category" />
        <FormCard>
          <ChipSelect
            label="Type"
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
          />
        </FormCard>
      </ScrollView>
    </SafeAreaView>
  );
}
