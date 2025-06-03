import { ThemedText } from "@/components/ThemedText";
import WordsDB, { ScheduledNotificationInsert } from "@/controller/handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

export default function ScheduledList() {
  const [scheduled, setScheduled] = useState<ScheduledNotificationInsert[]>([]);

  const loadNotifications = async () => {
    const notifs = await WordsDB.getNotifications();
    setScheduled(notifs);
  };

  const deleteF = async (id:number) => {
    await WordsDB.deleteNotifications(id);
    loadNotifications();
    Alert.alert("Success", "Notification Delete Successfully")
  };

  const updateF = async (type:boolean,id:number) => {
    const tt = !!type ? 0 : 1;
    await WordsDB.updateNotification(tt,id);
    loadNotifications();
    Alert.alert("Success", "Notification Updated Successfully")
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ListEmptyComponent={
          <ThemedText style={{ textAlign: "center", marginTop: 100 }}>
            No notifications scheduled.
          </ThemedText>
        }
        data={scheduled}
        style={{ padding: 10 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.item}>
              <View key={item.id}>
                <ThemedText>
                  🔔 {"Notification For (" + (item.type || "Any") + ")"}
                </ThemedText>
                <ThemedText>
                  {item.repeat_interval + " Minutes Interval "}
                </ThemedText>
              </View>
              <View style={{ flexDirection: "column",gap:4, justifyContent: "center" }}>
                <MaterialIcons
                  name={item.is_active ? "stop-circle":"run-circle"}
                  size={38}
                  title="Cancel All Notification"
                  onPress={()=>updateF(Boolean(item.is_active),Number(item.id))}
                  color="green"
                />
                <MaterialIcons
                  name="cancel"
                  size={38}
                  onPress={()=>deleteF(Number(item.id))}
                  color="#b83f33"
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
