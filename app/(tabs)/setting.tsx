import { initializeNotifications } from "@/components/notify";
import Item from "@/components/Settings/item";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  NativeEventEmitter,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

// Always initialize notifications once
initializeNotifications();

export default function NotificationControlScreen() {
  const [onScreenOn, setOnScreenOn] = useState(true);
  const [onUserUnlock, setOnUserUnlock] = useState(false);
  const [onScreenOff, setOnScreenOff] = useState(false);

  //input
  const [type, setType] = useState("default");
  const [interval, setInterval] = useState("1");

  const [son, setOn] = useState("");
  const [soff, setOff] = useState("");
  const [spresent, setPresent] = useState("");

  const scheduleNotificationAsync = async (type?: string, seconds?: number) => {
    console.log(spresent);
    const word = await WordsDB.getRandWord(type); // 👈 Use your existing function
    if (!word) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Sorry !",
          body: "Notification not working right now",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: seconds
          ? {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds,
              repeats: false,
            }
          : null,
      });
    } else {
      // 💬 Create dynamic message based on word type
      let title = `${word.word}: ${word.meaning} (${word.type}) 🎉`;
      let body = `Example : ${word.example}`;
      if (word.type === "verb") {
        body = `1st: ${word.form1}  |  2nd: ${word.form2}  |  3rd: ${word.form3} \n${body}`;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: seconds
          ? {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds,
              repeats: false,
            }
          : null,
      });
    }
  };

  const handleScreenEvent = (eventType: string) => {
    if (eventType === "SCREEN_ON" && onScreenOn) {
      console.log("Event: ", eventType);
      scheduleNotificationAsync(son);
    } else if (eventType === "SCREEN_OFF" && onScreenOff) {
      scheduleNotificationAsync(soff);
    } else if (eventType === "USER_PRESENT" && onUserUnlock) {
      scheduleNotificationAsync(spresent);
    }
  };

  useEffect(() => {
    const emitter = new NativeEventEmitter(NativeModules.NativeEventModule);
    const sub = emitter.addListener("SCREEN_EVENT", handleScreenEvent);

    return () => sub.remove();
  }, [onScreenOn, onUserUnlock, onScreenOff, son, soff, spresent]);

  const applyChanges = async () => {
    await WordsDB.SettingUpdate({ type, timer: Number(interval) });
    console.log("stop")
    NativeModules.NativeEventModule.stopForgroundService();
    setTimeout(() => {
      NativeModules.NativeEventModule.startForgroundService();
      console.log("start")
    }, 5000); // 5 second delay
  };

  const getSettings = async () => {
    const res = await WordsDB.getSetting();
    const setting = res[0]; // ✅ Get the first result

    if (setting) {
      setType(setting.type ?? "default");
      setInterval(String(setting.timer));
    }
  };

  useEffect(() => {
    getSettings(); // Load settings when component mounts
  }, []); // Run only once

  const navigation = useRouter();
  const isDarkMode = useColorScheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView>
        <Item
          icon={
            <Octicons
              name="screen-normal"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
          }
          title="Notify on Screen ON"
          link={
            <Switch
              style={{ height: 20 }}
              value={onScreenOn}
              onValueChange={setOnScreenOn}
            />
          }
          comp={
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 100,
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholder="Enter word"
              value={son}
              onChangeText={setOn}
            />
          }
        />
        <Item
          icon={
            <Octicons
              name="unlock"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
          }
          comp={
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 100,
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholder="Enter word"
              value={spresent}
              onChangeText={setPresent}
            />
          }
          title="Notify on Unlock"
          link={
            <Switch
              style={{ height: 20 }}
              value={onUserUnlock}
              onValueChange={setOnUserUnlock}
            />
          }
        />
        <Item
          icon={
            <MaterialIcons
              name="screen-lock-portrait"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
          }
          comp={
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 100,
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholder="Enter word"
              value={soff}
              onChangeText={setOff}
            />
          }
          title="Notify on User Present "
          link={
            <Switch
              style={{ height: 20 }}
              value={onScreenOff}
              onValueChange={setOnScreenOff}
            />
          }
        />

        <Divider title="Preferences" />
        <Item
          icon={
            <MaterialIcons
              name="schedule"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
          }
          title="Create Schedule Notification"
          onPress={() => navigation.push("/notifications")}
        />
        <Item
          icon={
            <Feather
              name="list"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
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
            <TextInput
              style={[
                styles.input,
                {
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholder="Enter word"
              value={type}
              onChangeText={setType}
              onEndEditing={applyChanges}
            />
          </View>
          <View style={styles.items}>
            <ThemedText style={styles.label}>Interval (min)</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholder="Enter word"
              keyboardType="number-pad"
              value={String(interval)}
              onChangeText={setInterval}
              onEndEditing={applyChanges}
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
          icon={
            <Feather
              name="info"
              size={18}
              color={isDarkMode ? "#fff" : "#000"}
            />
          }
          
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
