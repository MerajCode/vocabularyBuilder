import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { databaseName, sqliteDb } from "@/controller/database";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DTheme, LTheme } from "@/utils/themeColors";
import { SQLiteProvider } from "expo-sqlite";
import { useSQLiteDevTools } from "expo-sqlite-devtools";
import { useEffect } from "react";
import { PermissionsAndroid, Platform, Text } from "react-native";
import {
  PaperProvider
} from "react-native-paper";


export default function RootLayout() {
  useSQLiteDevTools(sqliteDb);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        ]);
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    }
  };

  requestPermissions().catch((err) => console.warn("Permission error:", err));
}, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    console.log("Loading fonts...")
    return <Text style={{ padding: 50 }}>Loading fonts...</Text>;
  }

  return (
    <PaperProvider theme={colorScheme === "dark" ? DTheme : LTheme}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SQLiteProvider databaseName={databaseName}>
          <Stack
            screenOptions={{
              animation: "ios_from_right",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="notifications"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </SQLiteProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
