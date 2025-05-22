import { initializeNotifications } from "@/components/notify";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";

initializeNotifications();

export default function Index() {
  const [customTime, setCustomTime] = useState("10"); // in seconds
  const [type, setType] = useState("verb"); // in seconds
  const [repeat, setRepeat] = useState(false);

  //   const { WordNotificationModule } = NativeModules;

  // type WordData = {
  //   word: string;
  //   type?: string | null;
  //   meaning?: string | null;
  //   form1?: string | null;
  //   form2?: string | null;
  //   form3?: string | null;
  //   example?: string | null;
  // };

  // const showNativeWordNotification = (word: WordData) => {
  //   WordNotificationModule.showNotification(word);
  // };

  const navigation = useRouter();

  const scheduleNotificationAsync = async (
    seconds?: number,
    repeats = false
  ) => {
    const word = await WordsDB.getRandWord(type); // 👈 Use your existing function
    if (!word) {
      Alert.alert("Error", "Somthing Went Wrong!");
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
          data: { type },
        },
        trigger: seconds
          ? {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds,
              repeats,
            }
          : null,
      });
      Alert.alert("Success", "Scheduled successfully.");
    }
  };

  const isDarkMode = useColorScheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Time Input */}
      <View style={{ paddingVertical: 10 }}>
        <ThemedText>Custom Time (in minuts)</ThemedText>
        <TextInput
          value={customTime}
          onChangeText={setCustomTime}
          keyboardType="numeric"
          style={[styles.input, { color: isDarkMode ? "white" : "black" }]}
        />
      </View>

      <View style={{ paddingVertical: 10 }}>
        <ThemedText>Word Type</ThemedText>
        <TextInput
          value={type}
          placeholder="Enter Type"
          onChangeText={setType}
          style={[styles.input, { color: isDarkMode ? "white" : "black" }]}
        />
      </View>

      {/* Repeat Switch */}
      <View style={styles.row}>
        <ThemedText>Repeat Notification</ThemedText>
        <Switch value={repeat} onValueChange={setRepeat} />
      </View>

      {/* Buttons */}
      <View style={styles.section}>
        <Button
          title="Schedule Notification"
          onPress={() =>
            scheduleNotificationAsync(Number(customTime) * 60, repeat)
          }
        />
        <Button
          title="Schedule List"
          onPress={() => navigation.push("/notifications/scheduled")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
    borderRadius: 5,
  },
  section: {
    marginTop: 30,
    gap: 10,
  },
});
