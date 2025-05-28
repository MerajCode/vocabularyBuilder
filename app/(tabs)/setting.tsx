import Item from "@/components/Settings/item";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
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

  const updateSettings = async () => {
    await WordsDB.SettingUpdate({
      //sticky
      type: stickySetting?.type,
      timer: stickySetting?.interval,
      //switches
      unlockStatus: unlock.status,
      unlockType: unlock.type,
      presentStatus: present.status,
      presentType: present.type,
    });
    // NativeModules.NativeEventModule.stopForgroundService();
    // setTimeout(() => {
    //   NativeModules.NativeEventModule.startForgroundService();
    //   console.log("start")
    // }, 5000); // 5 second delay
  };

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
    }
  };

  useEffect(() => {
    getSettings(); // Load settings when component mounts
  }, []); // Run only once

  const navigation = useRouter();
  const navigate = useNavigation();

  navigate.setOptions({
    headerRight: () => (
      <TouchableHighlight onPress={updateSettings} style={{flexDirection:"row",alignItems:"center",gap:1,backgroundColor:"rgb(6, 188, 238)"}} >
        <Text>Update</Text>
        <MaterialIcons name="sync" size={20} color={Dark} />
      </TouchableHighlight>
    ),
  });

  //dark component style
  const isDarkMode = useColorScheme();
  const Dark = isDarkMode === "dark" ? "#fff" : "#000";
  const Darkb = isDarkMode === "dark" ? "#444" : "#ccc";

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
              onValueChange={(status) =>
                setUnlock((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 100,
                  color: Dark,
                  borderColor: Darkb,
                },
              ]}
              placeholder="Enter word"
              value={present.type}
              onChangeText={(type) => setPresent((pre) => ({ ...pre, type }))}
            />
          }
        />
        <Item
          icon={<Octicons name="unlock" size={18} color={Dark} />}
          title="Notify on Unlock"
          link={
            <Switch
              style={{ height: 20 }}
              value={unlock.status}
              onValueChange={(status) =>
                setUnlock((pre) => ({ ...pre, status }))
              }
            />
          }
          comp={
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 100,
                  color: Dark,
                  borderColor: Darkb,
                },
              ]}
              placeholder="Enter word"
              value={unlock.type}
              onChangeText={(type) => setUnlock((pre) => ({ ...pre, type }))}
            />
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
            <TextInput
              style={[
                styles.input,
                {
                  color: Dark,
                  borderColor: Darkb,
                },
              ]}
              placeholder="Enter word"
              value={stickySetting.type}
              onChangeText={(type) =>
                setStickySetting((pre) => ({ ...pre, type }))
              }
            />
          </View>
          <View style={styles.items}>
            <ThemedText style={styles.label}>Interval (min)</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: Dark,
                  borderColor: Darkb,
                },
              ]}
              placeholder="Enter word"
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
        <View>
          <TouchableHighlight onPress={updateSettings}>
            <Button title="Apply Changes" />
          </TouchableHighlight>
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
        fontSize: 16,
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
    borderWidth: 1,
    minWidth: 150,
    maxHeight: 38,
    backgroundColor: "none",
    borderRadius: 50,
    textAlign: "center",
    marginTop: 4,
  },
  items: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
