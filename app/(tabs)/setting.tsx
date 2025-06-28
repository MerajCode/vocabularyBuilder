import MultiSelectBox from "@/components/Form/MultiSelectBox";
import Item from "@/components/Settings/item";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { opts } from "@/utils/staticData";
import { DTheme, LTheme } from "@/utils/themeColors";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button, Switch, TextInput as TextInput2 } from "react-native-paper";

// Always initialize notifications once

interface switchProps {
  type: string;
  status: boolean;
}

interface stickyProps {
  type: string;
  interval: number;
}

export default function NotificationControlScreen() {
  //switches
  const [present, setPresent] = useState<switchProps>({
    type: "",
    status: false,
  });
  const [unlock, setUnlock] = useState<switchProps>({
    type: "",
    status: false,
  });
  const [apiKey, setApiKey] = useState<string>("");

  //sticky
  const [stickySetting, setStickySetting] = useState<stickyProps>({
    type: "",
    interval: 144,
  });

  const updateSettings = useCallback(async () => {
    Alert.alert("Success", "updated successfully.");
    await WordsDB.SettingUpdate({
      type: stickySetting.type,
      timer: stickySetting.interval,
      unlockStatus: unlock.status,
      unlockType: unlock.type,
      presentStatus: present.status,
      presentType: present.type,
      apiKey: apiKey,
    });

    NativeModules.NativeEventModule.updateStickyNotification();
  }, [stickySetting, unlock, present, apiKey]);

  useEffect(() => {
    const getSettings = async () => {
      const res = await WordsDB.getSetting();
      const setting = res[0];
      if (setting) {
        setStickySetting({ type: setting.type ?? "", interval: setting.timer });

        setPresent({
          status: setting.presentStatus ?? false,
          type: setting.presentType ?? "",
        });
        setUnlock({
          status: setting.unlockStatus ?? false,
          type: setting.unlockType ?? "",
        });
        setApiKey(setting.apiKey ?? "");
      }
    };
    getSettings(); // Load settings when component mounts
  }, []);

  const navigation = useRouter();
  const navigate = useNavigation();

  //dark component style
  const isDarkMode = useColorScheme();
  const theme = isDarkMode === "dark" ? DTheme : LTheme;

  useEffect(() => {
    navigate.setOptions({
      headerRight: () => <Button onPress={updateSettings} icon={"update"} >Update</Button>,
    });
  }, [navigate, updateSettings]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Item
          icon={
            <Octicons
              name="screen-normal"
              size={18}
              color={theme.colors.onSurface}
            />
          }
          title="Notify on User Present"
          link={
            <Switch
              value={present.status}
              onValueChange={(status) =>
                setPresent((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <View style={{ width: 90 }}>
              <MultiSelectBox
                selectedValue={present.type}
                placeholder="Any"
                onValueChange={(type) =>
                  setPresent((pre) => ({ ...pre, type }))
                }
                options={opts}
              />
            </View>
          }
        />
        <Item
          icon={
            <Octicons name="unlock" size={18} color={theme.colors.onSurface} />
          }
          title="Notify on Unlock"
          link={
            <Switch
              value={unlock.status}
              onValueChange={(status) =>
                setUnlock((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <View style={{ width: 90 }}>
              <MultiSelectBox
                selectedValue={unlock.type}
                placeholder="Any"
                onValueChange={(type) => setUnlock((pre) => ({ ...pre, type }))}
                options={opts}
              />
            </View>
          }
        />

        <Divider title="Schedule Notifications" />
        <Item
          icon={
            <MaterialIcons
              name="schedule"
              size={18}
              color={theme.colors.onSurface}
            />
          }
          title="Create Schedule Notification"
          onPress={() => navigation.push("/notifications")}
        />
        <Item
          icon={
            <Feather name="list" size={18} color={theme.colors.onSurface} />
          }
          title="Schedule List"
          onPress={() => navigation.push("/notifications/scheduled")}
        />

        <Divider title="Sticky Notification Setting" />

        <View style={styles.container}>
          <ThemedText
            style={{ fontSize: 13, paddingBottom: 5, fontStyle: "italic" }}
          >
            If you want all words set default.
          </ThemedText>
          <View style={styles.items}>
            <ThemedText style={styles.label}>Word Type</ThemedText>
            <View style={[styles.input, { width: 90 }]}>
              <MultiSelectBox
                selectedValue={stickySetting.type}
                placeholder="Any"
                onValueChange={(type) =>
                  setStickySetting((pre) => ({ ...pre, type }))
                }
                options={opts}
              />
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.items}>
            <ThemedText style={styles.label}>Interval (min)</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.colors.onSurface,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                  borderRadius: 5,
                },
              ]}
              placeholderTextColor={theme.colors.onSurface}
              keyboardType="number-pad"
              value={String(stickySetting.interval)}
              onChangeText={(interval) =>
                setStickySetting((pre) => ({
                  ...pre,
                  interval: Number(interval),
                }))
              }
            />
          </View>
        </View>
        <Divider title="Enter Google Ai Studio Api Key" />
        <TextInput2
          value={apiKey}
          secureTextEntry
          mode="outlined"
          outlineStyle={{ borderRadius: 13 }}
          dense={true}
          style={{ marginHorizontal: 8, textAlign: "center" }}
          returnKeyType="next"
          onChangeText={(api) => setApiKey(api)}
        />
        <Item
          icon={
            <Feather name="info" size={18} color={theme.colors.onSurface} />
          }
          title="About App"
          onPress={() => navigation.push("/notifications/about")}
        />
        <ThemedText
          style={{
            padding: 15,
            fontSize: 14,
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Type valid word type from your list to continue exploring new
          vocabulary!
        </ThemedText>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Divider = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Inter-Bold",
        fontWeight: "bold",
        fontSize: 17,
        paddingVertical: 5,
        paddingHorizontal: 8,
        color: "#959595",
      }}
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    minWidth: 150,
    maxHeight: 40,
    textAlign: "center",
    marginTop: 4,
  },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
