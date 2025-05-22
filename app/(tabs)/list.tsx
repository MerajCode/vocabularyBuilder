import Title from "@/components/title";
import WordsDB, { WordData } from "@/controller/handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Word extends WordData {
  id: number;
  created_at: string;
}

export default function WordList() {
  const [words, setWords] = useState<Word[]>([]);

  const loadWords = async () => {
    const allWords = await WordsDB.getAllWords();
    setWords(allWords);
  };

  const deleteWord = async (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this word?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await WordsDB.deleteWord(id);
            loadWords(); // Refresh after delete
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        ListHeaderComponent={<Title title={"("+words.length+") Word List"} />}
        ListEmptyComponent={<Text style={styles.empty}>No words found.</Text>}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.wordItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.wordText}>
                {item.word} ({item.type})
              </Text>
              {item.meaning && (
                <Text style={styles.meaning}>💡 {item.meaning}</Text>
              )}
              {item.form1 && (
                <Text style={styles.forms}>
                  🧩 Forms: {item.form1}, {item.form2}, {item.form3}
                </Text>
              )}
              {item.example && (
                <Text style={styles.example}>✏️ {item.example}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteWord(item.id)}>
              <MaterialIcons name="delete-sweep" size={32} color="#b01a0c" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scroll: {
    paddingBottom: 20,
  },
  empty: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  wordItem: {
    flexDirection: "row",
    backgroundColor: "#b8b8b8",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  meaning: {
    fontSize: 14,
    color: "#333",
  },
  forms: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
  },
  example: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
});
