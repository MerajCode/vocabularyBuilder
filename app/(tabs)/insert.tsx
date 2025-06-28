import SelectBox from "@/components/Form/SelectBox";
import ModalComponent from "@/components/ModalComponent";
import SegmentDropdown from "@/components/SegmentDropdown";
import { ThemedText } from "@/components/ThemedText";
import externalApi from "@/controller/externalApi";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useFormNavigation from "@/hooks/useFormNavigation";
import { opts } from "@/utils/staticData";
import { Meanings, ProcessedResult } from "@/utils/Type/ExApi";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

type Loading = {
  search: boolean;
  meaning: boolean;
  example: boolean;
};

const Insert = () => {
  const { inputRefs, focusNext } = useFormNavigation(6);
  const [modalVisible, setModalVisible] = useState(false);

  const [word, setWord] = useState("");
  const [type, setType] = useState("");
  const [meaning, setMeaning] = useState("");
  const [form1, setForm1] = useState("");
  const [form2, setForm2] = useState("");
  const [form3, setForm3] = useState("");
  const [example, setExample] = useState("");
  const [searchBy, setSearchBy] = useState<"ai" | "dictionary">("ai");
  const [TLang, setTLang] = useState("hi-IN");

  const handleInsert = async () => {
    if (!word.trim()) {
      Alert.alert("Validation", "Word is required.");
      return;
    }

    try {
      await WordsDB.insertWord({
        word: word.trim(),
        type: type || null,
        meaning: meaning || null,
        form1: form1 || null,
        form2: form2 || null,
        form3: form3 || null,
        example: example || null,
      });

      Alert.alert("Success", "Word inserted successfully.");
      setWord("");
      setType("");
      setMeaning("");
      setForm1("");
      setForm2("");
      setForm3("");
      setExample("");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to insert word.");
    }
  };

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

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
    iconColor: isDarkMode ? "#FFFFFF" : "#000000",
  };

  //External API

  const [data, setData] = useState<ProcessedResult>();
  const [loading, setLoading] = useState<Loading>({
    search: false,
    meaning: false,
    example: false,
  });

  const getCategoryStyle = (category: string) => {
    const categoryColors: { [key: string]: string } = {
      noun: "#007AFF", // Blue
      adjective: "#34C759", // Green
      verb: "#FF9500", // Orange
      adverb: "#AF52DE", // Purple
      default: "#8E8E93", // Gray for others
    };

    const backgroundColor =
      categoryColors[category] || categoryColors["default"];
    return { backgroundColor };
  };

  const cache = useRef<Record<string, ProcessedResult>>({});

  const handleSearch = useCallback(async () => {
    if (!word) return;

    setModalVisible(true);
    setLoading((prev) => ({ ...prev, search: true }));

    if (cache.current[word + searchBy]) {
      setData(cache.current[word + searchBy]);
      setLoading((prev) => ({ ...prev, search: false }));
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

    setLoading((prev) => ({ ...prev, search: false }));
  }, [word, searchBy]);

  const handleChange = (item: Meanings) => {
    setModalVisible(false);
    setMeaning(item.definition);
    setType(item.type.toLowerCase());
    setExample(
      item.examples
        ? item.examples[Math.floor(Math.random() * item.examples.length)]
        : ""
    );
    setForm1(item.verb_forms?.base_form || "");
    setForm2(item.verb_forms?.past_simple || "");
    setForm3(item.verb_forms?.past_participle || "");
  };

  const handleTranslate = async (type?: string) => {
    if (type === "m") setLoading((prev) => ({ ...prev, meaning: true }));
    else setLoading((prev) => ({ ...prev, example: true }));

    if (!meaning.trim()) {
      Alert.alert("Validation", "Meaning is required.");
      return;
    }
    try {
      const res = await externalApi.translate(meaning, TLang);
      if (type === "m")
        setMeaning((prev) => (res.statusCode === 200 ? res.data : prev));
      else setExample((prev) => (res.statusCode === 200 ? res.data : prev));
    } catch (err) {
      console.log(err);
    }

    if (type === "m") setLoading((prev) => ({ ...prev, meaning: false }));
    else setLoading((prev) => ({ ...prev, example: false }));
  };

  const renderComponent = ({ item }: { item: Meanings }) => {
    const categoryStyle = getCategoryStyle(item.type);
    return (
      <Pressable
        key={item.id ?? Math.random().toString(36).substring(2, 9)}
        style={({ pressed }) => [
          styles.card,
          themeStyles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={() => handleChange(item)}
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
              {example}
            </Text>
          ))}
          {item.verb_forms && (
            <Text
              style={[themeStyles.secondaryText,{fontWeight:"bold",fontSize:18,textAlign:"center",paddingTop:5}]}
            >
              1st:{item.verb_forms.base_form} | 2nd:{item.verb_forms.past_simple} | 
              3rd:{item.verb_forms.past_participle}
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <ThemedText
            style={{
              marginBottom: 14,
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 20,
              textTransform: "uppercase",
              color: isDarkMode ? "#fff" : "#444",
            }}
          >
            Insert New Word
          </ThemedText>
          <View
            style={{
              padding: 10,
              backgroundColor: isDarkMode ? "#222" : "#fff",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              marginTop: 12,
            }}
          >
            <SegmentedButtons
              value={searchBy}
              onValueChange={(val) => setSearchBy(val)}
              density="small"
              style={{ marginBottom: 8 }}
              buttons={[
                { value: "dictionary", label: "NORMAL" },
                { value: "ai", label: "AI" },
              ]}
            />

            <TextInput
              ref={inputRefs[0]}
              onSubmitEditing={() => focusNext(0)}
              label={"Enter word"}
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              value={word}
              onChangeText={setWord}
              mode="outlined"
              outlineStyle={{ borderRadius: 13 }}
              returnKeyType="search"
              right={<TextInput.Icon icon={"magnify"} onPress={handleSearch} />}
            />
          </View>

          {/* Search drawer start */}
          <View
            style={{
              position: "absolute",
              right: 0,
              top: 4.1,
            }}
          >
            <ModalComponent
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              onPress={handleSearch}
              header={{ title: "Search Word" }}
            >
              {loading.search ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Loading...</Text>
                </View>
              ) : (
                <FlatList
                  data={data?.meanings}
                  renderItem={renderComponent}
                  keyExtractor={(item) => item.id}
                  style={{ paddingHorizontal: 16 }}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={themeStyles.mainText}>
                        No word found. 😔
                      </Text>
                    </View>
                  }
                />
              )}
            </ModalComponent>
          </View>
          {/* Search drawer end*/}
          <View
            style={{
              padding: 10,
              backgroundColor: isDarkMode ? "#222" : "#fff",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              marginTop: 12,
            }}
          >
            <SegmentDropdown setType={setTLang} type={TLang} />
            <TextInput
              ref={inputRefs[1]}
              onSubmitEditing={() => focusNext(1)}
              mode="outlined"
              outlineStyle={{ borderRadius: 13 }}
              returnKeyType="next"
              style={[
                styles.input,
                {
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              label="Enter meaning"
              value={meaning}
              onChangeText={setMeaning}
              right={
                <TextInput.Icon
                  icon={"translate"}
                  loading={loading.meaning}
                  onPress={() => handleTranslate("m")}
                />
              }
            />

            <TextInput
              ref={inputRefs[5]}
              onSubmitEditing={() => focusNext(5)}
              style={[
                styles.input,
                {
                  color: isDarkMode ? "#fff" : "#000",
                  borderColor: isDarkMode ? "#444" : "#ccc",
                },
              ]}
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              label="Example e.g. I run every day."
              mode="outlined"
              outlineStyle={{ borderRadius: 13 }}
              returnKeyType="next"
              value={example}
              onChangeText={setExample}
              right={
                <TextInput.Icon
                  icon={"translate"}
                  loading={loading.example}
                  onPress={() => handleTranslate()}
                />
              }
            />
          </View>
          <Text
            style={[
              styles.label,
              {
                color: isDarkMode ? "#fff" : "#444",
                marginBottom: 5,
                fontSize: 15,
              },
            ]}
          >
            Word Type
          </Text>
          <SelectBox
            onValueChange={setType}
            selectedValue={type}
            placeholder="Select Type"
            options={opts}
          />
          {type === "verb" && (
            <View>
              <TextInput
                ref={inputRefs[2]}
                onSubmitEditing={() => focusNext(2)}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
                label="First Form e.g. run"
                mode="outlined"
                outlineStyle={{ borderRadius: 13 }}
                returnKeyType="next"
                value={form1}
                onChangeText={setForm1}
              />
              <TextInput
                ref={inputRefs[3]}
                onSubmitEditing={() => focusNext(3)}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                label="e.g. ran"
                mode="outlined"
                outlineStyle={{ borderRadius: 13 }}
                returnKeyType="next"
                value={form2}
                onChangeText={setForm2}
              />

              <TextInput
                ref={inputRefs[4]}
                onSubmitEditing={() => focusNext(4)}
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
                label="e.g. run"
                mode="outlined"
                outlineStyle={{ borderRadius: 13 }}
                returnKeyType="next"
                value={form3}
                onChangeText={setForm3}
              />
            </View>
          )}

          <Button
            mode={"contained"}
            uppercase
            style={{ paddingVertical: 3, marginTop: 15 }}
            onPress={handleInsert}
          >
            Insert Word
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0a7ea4",
    padding: 15,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    elevation: 3,
  },
  ///
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    // Note: No position:'relative' needed in React Native for this
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  // --- NEW STYLES FOR THE TAG ---
  categoryContainer: {
    position: "absolute", // Yeh tag ko card ke upar position karega
    top: -1, // Card ke border se thoda upar
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderTopLeftRadius: 0, // Ek pin jaisa look dene ke liye
    elevation: 5, // Thoda sa shadow
  },
  categoryTagText: {
    color: "#FFFFFF", // Safed text
    fontSize: 12,
    fontWeight: "bold",
  },
  // --- NEW CONTAINER FOR CONTENT ---
  contentContainer: {
    marginTop: 24, // Tag ke liye jagah banane ke liye
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
  soundButton: {
    padding: 8,
  },
  exampleText: {
    fontSize: 16,
    marginTop: 12, 
  },
  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Insert;
