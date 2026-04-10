import { useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BackButton,
  StatusBadge,
  DeleteButton,
  SearchBar,
  FilterTabs,
  SegmentedControl,
  ProgressBar,
  RatingStars,
  EmptyState,
  FAB,
  IconCard,
  StatCard,
  SectionHeader,
  CollapsibleSection,
  TimelineItem,
  StatusSelector,
  ToggleCard,
  ConfirmSheet,
  DeadlineChip,
  HorizontalChipSelect,
} from "@drakkar.software/seahorse/components";
import { ImageBackground, FlashList } from "@drakkar.software/seahorse/primitives";
import { Star, Package, Users } from "lucide-react-native";

const STATUSES = [
  { key: "pending", label: "Pending", color: "#F59E0B" },
  { key: "confirmed", label: "Confirmed", color: "#10B981" },
  { key: "cancelled", label: "Cancelled", color: "#EF4444" },
];

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "done", label: "Done" },
];

const CHIP_OPTIONS = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

export default function ComponentsScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [chip, setChip] = useState("week");
  const [segment, setSegment] = useState("list");
  const [rating, setRating] = useState(3);
  const [status, setStatus] = useState("pending");
  const [toggled, setToggled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={["bottom"]}>
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 20 }}>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Search & Filter</Text>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Search items…" />
          <FilterTabs tabs={FILTER_TABS} activeKey={filter} onSelect={setFilter} />
          <HorizontalChipSelect options={CHIP_OPTIONS} activeKey={chip} onSelect={setChip} />
          <SegmentedControl
            segments={[{ key: "list", label: "List" }, { key: "grid", label: "Grid" }]}
            activeKey={segment}
            onSelect={setSegment}
          />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Badges & Status</Text>
          <View className="flex-row gap-2 flex-wrap">
            <StatusBadge label="Confirmed" color="#10B981" />
            <StatusBadge label="Pending" color="#F59E0B" />
            <StatusBadge label="Cancelled" color="#EF4444" />
            <DeadlineChip date={nextWeek} />
          </View>
          <StatusSelector options={STATUSES} activeKey={status} onSelect={setStatus} />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cards</Text>
          <View className="flex-row gap-2">
            <StatCard label="Guests" value="42" icon={Users} className="flex-1" />
            <StatCard label="Items" value="18" icon={Package} className="flex-1" />
          </View>
          <IconCard
            icon={Star}
            title="Premium Feature"
            subtitle="Unlock advanced capabilities"
            onPress={() => Alert.alert("Pressed")}
          />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Progress & Rating</Text>
          <ProgressBar progress={0.65} />
          <RatingStars value={rating} onChange={setRating} />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Sections</Text>
          <SectionHeader title="My Section" count={5} onAdd={() => Alert.alert("Add")} />
          <CollapsibleSection title="Collapsible">
            <Text className="text-sm text-gray-600 dark:text-gray-400 p-2">
              Hidden content revealed on tap.
            </Text>
          </CollapsibleSection>
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Timeline</Text>
          <TimelineItem
            title="Contract signed"
            subtitle="Venue confirmed"
            date="Jan 15, 2026"
            isLast={false}
          />
          <TimelineItem
            title="Deposit paid"
            subtitle="Payment processed"
            date="Jan 20, 2026"
            isLast
          />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Toggle & Actions</Text>
          <ToggleCard
            title="Enable notifications"
            subtitle="Receive reminders"
            value={toggled}
            onChange={setToggled}
          />
          <DeleteButton onPress={() => setShowConfirm(true)} label="Delete item" />
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Navigation & Media</Text>
          <BackButton text="Go back" onPress={() => Alert.alert("Back pressed")} />
          <ImageBackground
            source={{ uri: "https://picsum.photos/800/200" }}
            className="rounded-xl overflow-hidden"
            style={{ height: 120 }}
          >
            <View className="flex-1 justify-end p-3">
              <Text className="text-white font-semibold text-sm">ImageBackground</Text>
            </View>
          </ImageBackground>
          <FlashList
            data={["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]}
            estimatedItemSize={40}
            style={{ height: 120 }}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                <Text className="text-sm">{item}</Text>
              </View>
            )}
          />
        </View>

        <EmptyState
          title="Nothing here yet"
          subtitle="Add your first item to get started"
          icon={Package}
        />

      </ScrollView>

      <FAB onPress={() => Alert.alert("FAB pressed")} />

      <ConfirmSheet
        visible={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => { setShowConfirm(false); Alert.alert("Deleted!"); }}
        title="Delete item?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
      />
    </SafeAreaView>
  );
}
