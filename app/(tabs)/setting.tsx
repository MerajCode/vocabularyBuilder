import SelectBox from "@/components/Form/SelectBox";
import Item from "@/components/Settings/item";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { opts } from "@/utils/staticData";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

  //sticky
  const [stickySetting, setStickySetting] = useState<stickyProps>({
    type: "",
    interval: 0,
  });

  const updateSettings = useCallback(async () => {
    console.log("running", stickySetting);
    await WordsDB.SettingUpdate({
      type: stickySetting.type,
      timer: stickySetting.interval,
      unlockStatus: unlock.status,
      unlockType: unlock.type,
      presentStatus: present.status,
      presentType: present.type,
    });

    NativeModules.NativeEventModule.updateStickyNotification();
    console.log("start");
  }, [stickySetting, unlock, present]);

  useEffect(() => {
    const getSettings = async () => {
      const res = await WordsDB.getSetting();
      const setting = res[0];
      console.log(setting);
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
      }
    };
    getSettings(); // Load settings when component mounts
  }, []);

  const navigation = useRouter();
  const navigate = useNavigation();

  //dark component style
  const isDarkMode = useColorScheme();
  const isDark = isDarkMode === "dark";
  const Dark = isDarkMode === "dark" ? "#fff" : "#000";

  useEffect(() => {
    navigate.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={updateSettings}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            right: 15,
            padding: 7,
            borderRadius: 10,
            backgroundColor:isDark ? "#242628":"#0a7ea4",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#fff" }}>Update</Text>
          <MaterialIcons name="sync" size={20} color={isDark ? "#aaa":"#fff"} />
        </TouchableOpacity>
      ),
    });
  }, [Dark, navigate, updateSettings]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView>
        <Item
          icon={<Octicons name="screen-normal" size={18} color={Dark} />}
          title="Notify on User Present"
          link={
            <Switch
              style={{ height: 20 }}
              value={present.status}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              onValueChange={(status) =>
                setPresent((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <View style={{ width: 90 }}>
              <SelectBox
                selectedValue={present.type}
                placeholder="Any"
                onValueChange={(type) =>
                  setPresent((pre) => ({ ...pre, type }))
                }
                options={cusOps}
              />
            </View>
          }
        />
        <Item
          icon={<Octicons name="unlock" size={18} color={Dark} />}
          title="Notify on Unlock"
          link={
            <Switch
              style={{ height: 20 }}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              value={unlock.status}
              onValueChange={(status) =>
                setUnlock((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <View style={{ width: 90 }}>
              <SelectBox
                selectedValue={unlock.type}
                placeholder="Any"
                onValueChange={(type) => setUnlock((pre) => ({ ...pre, type }))}
                options={cusOps}
              />
            </View>
          }
        />

        <Divider title="Schedule Notifications" />
        <Item
          icon={<MaterialIcons name="schedule" size={18} color={Dark} />}
          title="Create Schedule Notification"
          onPress={() => navigation.push("/notifications")}
        />
        <Item
          icon={<Feather name="list" size={18} color={Dark} />}
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
            <View style={[styles.input,{ width: 90 }]}>
              <SelectBox
                selectedValue={stickySetting.type}
                placeholder="Any"
                onValueChange={(type) =>setStickySetting((pre) => ({ ...pre, type }))}
                options={cusOps}
              />
            </View>
          </View>
          <View style={styles.items}>
            <ThemedText style={styles.label}>Interval (min)</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: Dark,
                  borderWidth:1,
                  borderColor:(isDark ? "#444" : "#ccc"),
                  borderRadius:5,
                },
              ]}
              placeholderTextColor={isDark ? "#aaa" : "#666"}
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
          <Item
            icon={<Feather name="info" size={18} color={Dark} />}
            title="About App"
            onPress={() => navigation.push("/notifications/about")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Divider = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Inter-Bold",
        fontWeight:"bold",
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

const cusOps = [{ value: "", label: "Any" },...opts];
