import { ThemedText } from "@/components/ThemedText";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, View } from "react-native";

export default function ScheduledList() {
  const [scheduled, setScheduled] = useState<Notifications.NotificationRequest[]>([]);

  const loadNotifications = async () => {
    const notifs = await Notifications.getAllScheduledNotificationsAsync();
    setScheduled(notifs);
  };

  const cancelAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <View style={styles.container} >
      <FlatList
        ListEmptyComponent={<ThemedText style={{ textAlign: "center", marginTop: 100 }}>No notifications scheduled.</ThemedText>}
        data={scheduled}
        style={{padding:10}}
        renderItem={({ item }) =>{
          const data:any = item.trigger;
          return(
          <View key={item.identifier} style={styles.item}>
            <ThemedText>🔔 {"Notification For ("+item.content.data.type+")"}</ThemedText>
            <ThemedText>{data.seconds/60+" Minutes | " + (data.repeats?"Frequantly":"Once") }</ThemedText>
          </View>
        )}
      }
      />

      <Button title="Cancel All Notification" onPress={cancelAll} color="#b83f33" />
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
  },
});
