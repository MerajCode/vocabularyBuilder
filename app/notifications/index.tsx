import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const [customTime, setCustomTime] = useState("10"); // in seconds
  const [type, setType] = useState("verb"); // in seconds

  const navigation = useRouter();

  const insertNotification = async () => {
    const result = await WordsDB.insertNotification({
      repeat_interval: Number(customTime),
      type,
    });
    if (!result) {
      Alert.alert("Error", "Somthing Went Wrong!");
      return;
    }
    Alert.alert("Success", "ID : " + result + " Scheduled successfully.");
  };
  // const scheduleNotificationAsync = async (
  //   seconds?: number,
  //   repeats = false
  // ) => {
  //   const word = await WordsDB.getRandWord(type);
  //   if (!word) {
  //     Alert.alert("Error", "Somthing Went Wrong!");
  //   } else {
  //     // 💬 Create dynamic message based on word type
  //     let title = `${word.word}: ${word.meaning}`;
  //     let body = `Example : ${word.example}`;
  //     if (word.type === "verb") {
  //       body = `1st: ${word.form1} | 2nd: ${word.form2} | 3rd: ${word.form3}`;
  //     }
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: title,
  //         body: body,
  //         priority: Notifications.AndroidNotificationPriority.HIGH,
  //         data: { type },
  //       },
  //       trigger: seconds
  //         ? {
  //             type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  //             seconds,
  //             repeats,
  //           }
  //         : null,
  //     });
  //     Alert.alert("Success", "Scheduled successfully.");
  //   }
  // };

  const isDarkMode = useColorScheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Time Input */}
      <ThemedText style={styles.header}>Schedule Notification</ThemedText>
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

      {/* Buttons */}
      <View style={styles.section}>
        <Button title="Schedule Notification" onPress={insertNotification} />
        <Button
          title="Schedule List"
          onPress={() => navigation.push("/notifications/scheduled")}
        />
      </View>
      <View style={styles.section}>
        <ThemedText style={{ textAlign: "center" ,fontSize:13,fontStyle:"italic"}}>Minimum allowed time is 1 minute. Please set your custom timer.</ThemedText>
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
    marginTop: 40,
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
