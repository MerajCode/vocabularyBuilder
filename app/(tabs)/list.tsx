import Title from "@/components/title";
import WordsDB, { WordData } from "@/controller/handler";
// import { WordData } from "@/utils/Type/Table";
import Octicons from "@expo/vector-icons/Octicons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function WordList() {
  const [words, setWords] = useState<WordData[]>([]);

  const loadWords = async () => {
    const allWords = await WordsDB.getAllwordlist();
    setWords(allWords);
  };

  const isDard = useColorScheme() === "dark";

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
          <View key={item.id} style={[styles.wordItem,{backgroundColor:isDard?"#242628":"#fff"}]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.wordText,{color:isDard?"#fff":"#000"}]}>
                {item.word} ({item.type})
              </Text>
              {item.meaning && (
                <Text style={[styles.meaning,{color:isDard?"#fff":"#000"}]}>💡  {item.meaning}</Text>
              )}
              {item.form1 && (
                <Text style={styles.forms}>
                  🧩  Forms:  {item.form1},  {item.form2},  {item.form3}
                </Text>
              )}
              {item.example && (
                <Text style={styles.example}>&quot; {item.example} &quot;</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteWord(Number(item.id))}>
              <Octicons name="repo-deleted" size={25} color={isDard ? "#5c5555" : "#ccc"} />
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
    color: "#B5AA8C",
    textAlign: "center",
    marginTop: 20,
  },
  wordItem: {
    flexDirection: "row",
    backgroundColor: "#242628",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  wordText: {
    fontSize: 18,
    fontWeight: "bold",
    color:"white",
    textTransform:"capitalize"
  },
  meaning: {
    fontSize: 16,
    fontWeight:"semibold",
    color: "white",
  },
  forms: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#555",
  },
  example: {
    fontSize: 16,
    fontWeight:"bold",
    color: "#B5AA8C",
    marginTop: 4,
    paddingTop:5,
    textAlign:"center"
  },
});
