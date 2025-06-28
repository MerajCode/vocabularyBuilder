import { ThemedText } from "@/components/ThemedText";
import externalApi from "@/controller/externalApi";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Meanings, ProcessedResult } from "@/utils/Type/ExApi";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

const Index = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [word, setWord] = useState("");
  const [searchBy, setSearchBy] = useState<"ai" | "dictionary">("dictionary");
  const [data, setData] = useState<ProcessedResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cache = useRef<Record<string, ProcessedResult>>({});

  const handleSearch = useCallback(async () => {
    if (!word) return;

    setLoading(true);
    setData(null);

    if (cache.current[word + searchBy]) {
      setData(cache.current[word + searchBy]);
      setLoading(false);
      return;
    }

    try {
      const res = await externalApi.getOrganizedWordDetails(word, searchBy);
      if (res.statusCode === 200) {
        cache.current[word + searchBy] = res.data;
        setData(res.data);
      } else {
        Alert.alert("Error", res.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to fetch data");
    }

    setLoading(false);
  }, [word, searchBy]);

  const themeStyles = {
    card: {
      backgroundColor: isDarkMode ? "#2C2C2E" : "#FFFFFF",
      borderColor: isDarkMode ? "#444" : "#EAEAEA",
    },
    mainText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
    },
    secondaryText: {
      color: isDarkMode ? "#A9A9A9" : "#555555",
    },
  };

  const getCategoryStyle = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      noun: "#007AFF", // Blue
      adjective: "#34C759", // Green
      verb: "#FF9500", // Orange
      adverb: "#AF52DE", // Purple
      default: "#8E8E93", // Gray for others
    };

    const backgroundColor =
      categoryColors[category.toLowerCase()] || categoryColors["default"];
    return { backgroundColor };
  };

  const handleClearSearch = () => {
    setData(null);
    setWord("");
  };

  const renderMeaningItem = ({ item }: { item: Meanings }) => {
    const categoryStyle = getCategoryStyle(item.type);
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          themeStyles.card,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.categoryContainer, categoryStyle]}>
          <Text style={styles.categoryTagText}>{item.type}</Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={[styles.meaningText, themeStyles.mainText]}>
              {item.definition}
            </Text>
          </View>

          {item.examples?.map((example, index) => (
            <Text
              key={index}
              style={[styles.exampleText, themeStyles.secondaryText]}
            >
              • {example}
            </Text>
          ))}
          {item.verb_forms && (
            <Text style={[styles.verbFormsText, themeStyles.secondaryText]}>
              Forms: {item.verb_forms.base_form} | {item.verb_forms.past_simple}{" "}
              | {item.verb_forms.past_participle}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {loading ? <ActivityIndicator style={{ position:"absolute",left:0,right:0,top:0,bottom:0 }} size="large" /> : ""}
      <MaterialIcons
        name="library-books"
        size={150}
        color={isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}
      />
      <ThemedText style={[styles.title, { paddingTop: 14,color:isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }]}>
        Welcome
      </ThemedText>
      <ThemedText style={[styles.title,{color:isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}]}>to VacabBuilder</ThemedText>
      <ThemedText style={[styles.subtitle,{color:isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}]}>
        Build your vocabulary easily with fun and interactive ways!
      </ThemedText>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <SegmentedButtons
              value={searchBy}
              onValueChange={(val) => setSearchBy(val as "ai" | "dictionary")}
              density="small"
              style={{ marginBottom: 8 }}
              buttons={[
                { value: "dictionary", label: "NORMAL" },
                { value: "ai", label: "AI" },
              ]}
            />
            <TextInput
              label={"Enter word"}
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              value={word}
              onChangeText={setWord}
              mode="outlined"
              outlineStyle={{ borderRadius: 13 }}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              right={
                <TextInput.Icon
                  icon={"magnify"}
                  onPress={handleSearch}
                  disabled={loading}
                />
              }
            />
          </View>
        }
        data={data?.meanings}
        renderItem={renderMeaningItem}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        style={{ width: "100%", marginTop: 20 }}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
      {data?.meanings && (
        <Button
          mode="elevated"
          style={{ bottom: 10, position: "absolute" }}
          onPress={handleClearSearch}
          icon={"close"}
        >
          Clear
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  searchContainer: {
    width: "100%",
    paddingBottom:15,
    backgroundColor: "transparent", // Let the theme handle it
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  categoryContainer: {
    position: "absolute",
    top: -1,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    elevation: 5,
  },
  categoryTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    marginTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meaningText: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  exampleText: {
    fontSize: 16,
    marginTop: 12,
    fontStyle: "italic",
  },
  verbFormsText: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: "#555",
  },
  emptyContainer: {
    paddingTop:50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
});

export default Index;
