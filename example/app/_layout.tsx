import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { ForgeThemeProvider } from "@drakkar.software/seahorse/theme";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ForgeThemeProvider
        theme={{ colors: { primary: "#3B82F6", destructive: "#EF4444" } }}
      >
        <BottomSheetModalProvider>
          <Stack>
            <Stack.Screen name="index" options={{ title: "SeaHorse Demo" }} />
            <Stack.Screen name="components" options={{ title: "Components" }} />
            <Stack.Screen name="forms" options={{ title: "Form Elements" }} />
            <Stack.Screen name="utils" options={{ title: "Utilities" }} />
          </Stack>
        </BottomSheetModalProvider>
      </ForgeThemeProvider>
    </GestureHandlerRootView>
  );
}
