import SelectBox from "@/components/Form/SelectBox";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { opts } from "@/utils/staticData";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function Index() {
  const [customTime, setCustomTime] = useState("10"); // in seconds
  const [type, setType] = useState<string>(""); // in seconds

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

  const isDarkMode = useColorScheme() === "dark";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Time Input */}
      <ThemedText style={styles.header}>Schedule Notification</ThemedText>
      <View style={{ paddingVertical: 10 }}>
        <TextInput
          mode="outlined"
          outlineStyle={{ borderRadius: 13 }}
          returnKeyType="next"
          value={customTime}
          onChangeText={setCustomTime}
          keyboardType="numeric"
          label={"Custom Time (in minuts)"}
          style={[
            styles.input,
            {
              color: isDarkMode ? "white" : "black",
              borderColor: isDarkMode ? "#444" : "#ccc",
            },
          ]}
        />
      </View>

      <View style={{ paddingVertical: 10, gap: 5 }}>
        <ThemedText>Word Type</ThemedText>
        <SelectBox
          onValueChange={setType}
          selectedValue={type}
          options={cusOps}
          placeholder="Word Type"
        />
      </View>

      {/* Buttons */}
      <View style={styles.section}>
        <Button mode="contained" onPress={insertNotification}>Schedule Notification</Button>
        <Button mode="contained" onPress={() => navigation.push("/notifications/scheduled")}>
          Schedule List
        </Button>
      </View>
      <View style={styles.section}>
        <ThemedText
          style={{ textAlign: "center", fontSize: 13, fontStyle: "italic" }}
        >
          Minimum allowed time is 1 minute. Please set your custom timer.
        </ThemedText>
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
    marginTop: 5,
  },
  section: {
    marginTop: 30,
    gap: 10,
  },
});

const cusOps = [{ value: "", label: "Any" }, ...opts];
