import { db } from "@/controller/database";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useEffect } from "react";
import { Alert } from "react-native";
import migrations from "../../drizzle/migrations";

const useMigrate = () => {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!success) return;
  }, [success]);

  if (error) {
    console.log(error.message)
    Alert.alert("Error", "Message:" + error.message);
    return;
  }
};

export default useMigrate;
