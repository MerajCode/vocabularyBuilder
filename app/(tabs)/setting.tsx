import { initializeNotifications } from "@/components/notify";
import Item from "@/components/Settings/item";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  NativeEventEmitter,
  NativeModules,
  ScrollView,
  Switch,
  Text
} from "react-native";

// Always initialize notifications once
initializeNotifications();

export default function NotificationControlScreen() {
  const [onScreenOn, setOnScreenOn] = useState(true);
  const [onUserUnlock, setOnUserUnlock] = useState(false);
  const [onScreenOff, setOnScreenOff] = useState(false);

  const scheduleNotificationAsync = async (type?:string,seconds?: number) => {
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
      let title = `${word.word}: ${word.meaning}`;
      let body = `Example : ${word.example}`;
      if (word.type === "verb") {
        body = `1st: ${word.form1} | 2nd: ${word.form2} | 3rd: ${word.form3}`;
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
    console.log("Event: ", eventType);

    if (eventType === "SCREEN_ON" && onScreenOn) {
      scheduleNotificationAsync("verb");
    } else if (eventType === "SCREEN_OFF" && onScreenOff) {
      scheduleNotificationAsync("noun");
    } else if (eventType === "USER_PRESENT" && onUserUnlock) {
      scheduleNotificationAsync("adjective");
    }
  };

  useEffect(() => {
    const emitter = new NativeEventEmitter(NativeModules.NativeEventModule);
    const sub = emitter.addListener("SCREEN_EVENT", handleScreenEvent);

    return () => sub.remove();
  }, [onScreenOn, onUserUnlock, onScreenOff]);

  const navigation = useRouter();
  const isDarkMode = useColorScheme();

  return (
    <ScrollView>
      <Item
        icon={
          <Octicons
            name="screen-normal"
            size={21}
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
      />
      <Item
        icon={
          <Octicons
            name="unlock"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
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
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        }
        title="Notify on Screen OFF"
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
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        }
        title="Create Schedule Notification"
        onPress={() => navigation.push("/notifications")}
      />
      <Item
        icon={
          <Feather name="list" size={24} color={isDarkMode ? "#fff" : "#000"} />
        }
        title="Schedule List"
        onPress={() => navigation.push("/notifications/scheduled")}
      />
    </ScrollView>
  );
}


const Divider = ({ title }: { title: string }) => {
  return (
    <Text
      style={{
        fontFamily: "Inter-Bold",
        fontSize: 13,
        paddingVertical: 5,
        paddingHorizontal: 8,
        color: "#959595",
      }}
    >
      {title}
    </Text>
  );
};
