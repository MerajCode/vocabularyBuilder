import UploadCSV from "@/components/bulk/UploadCSV";
import SelectBox from "@/components/Form/SelectBox";
import { ThemedText } from "@/components/ThemedText";
import WordsDB from "@/controller/handler";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { opts } from "@/utils/staticData";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const Insert = () => {
  const [word, setWord] = useState("");
  const [type, setType] = useState("");
  const [meaning, setMeaning] = useState("");
  const [form1, setForm1] = useState("");
  const [form2, setForm2] = useState("");
  const [form3, setForm3] = useState("");
  const [example, setExample] = useState("");

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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView>
        <View style={styles.container}>
          <UploadCSV />
          <ThemedText
            style={{
              marginBottom: 14,
              fontSize: 22,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Insert Single Word
          </ThemedText>
          <Text
            style={[
              styles.label,
              {
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
          >
            Word *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#444" : "#ccc",
              },
            ]}
            placeholder="Enter word"
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            value={word}
            onChangeText={setWord}
          />

          <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>
            Meaning
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#444" : "#ccc",
              },
            ]}
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            placeholder="Enter meaning"
            value={meaning}
            onChangeText={setMeaning}
          />

          <Text
            style={[
              styles.label,
              { color: isDarkMode ? "#fff" : "#000", marginBottom: 5 },
            ]}
          >
            Type
          </Text>
          <SelectBox
            onValueChange={setType}
            selectedValue={type}
            placeholder="Select Type"
            options={opts}
          />
          {type === "verb" && (
            <View>
              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Form 1
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
                placeholder="e.g. run"
                value={form1}
                onChangeText={setForm1}
              />

              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Form 2
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
                placeholder="e.g. ran"
                value={form2}
                onChangeText={setForm2}
              />

              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Form 3
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
                placeholder="e.g. run"
                value={form3}
                onChangeText={setForm3}
              />
            </View>
          )}
          <Text style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}>
            Example
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: isDarkMode ? "#fff" : "#000",
                borderColor: isDarkMode ? "#444" : "#ccc",
              },
            ]}
            placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
            placeholder="e.g. I run every day."
            value={example}
            onChangeText={setExample}
          />

          <View>
            <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleInsert}>
              <Text style={{fontSize:16,fontWeight:"bold",color:"#fff",textTransform:"uppercase"}}>Insert Word</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "none",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor:"#0a7ea4",
    padding: 15,
    fontWeight:"bold",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    elevation: 3,
  },
});

export default Insert;
