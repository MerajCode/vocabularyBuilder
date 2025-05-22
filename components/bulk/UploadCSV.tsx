// app/upload-csv.tsx (or route as needed)
import WordsDB from "@/controller/handler";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function UploadCSV() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    try {
      setStatus(null);
      setLoading(true);

      // Pick file
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        setStatus("File selection canceled.");
        setLoading(false);
        return;
      }

      const fileUri = result.assets[0].uri;

      // Read file content
      const content = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Call your method
      await WordsDB.bulkInsertFromCSV(content);
      setStatus("✅ Words inserted successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error inserting words: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={{ marginBottom: 20 ,fontSize:22}}>Insert bulk words</ThemedText>
      <Button title="📄 Upload CSV" onPress={handleUpload} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
});
