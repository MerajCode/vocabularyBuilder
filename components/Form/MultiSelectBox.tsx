import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import ModalComponent from "../ModalComponent";

interface ops {
  value: string;
  label: string;
}

interface props {
  options: ops[];
  selectedValue: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
}

const MultiSelectBox = ({
  options,
  selectedValue,
  onValueChange,
  placeholder,
}: props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const selectedItemsArray = useMemo(() => {
    if (!selectedValue) return [];
    const values = selectedValue.split(",");
    return options.filter((opt) => values.includes(opt.value));
  }, [selectedValue, options]);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const isSelected = (item: ops) => {
    return selectedItemsArray.some(
      (selectedItem) => selectedItem.value === item.value
    );
  };

  const handleSelect = (item: ops) => {
    const currentlySelected = isSelected(item);
    let newSelectedItems;

    if (currentlySelected) {
      newSelectedItems = selectedItemsArray.filter(
        (selected) => selected.value !== item.value
      );
    } else {
      newSelectedItems = [...selectedItemsArray, item];
    }
    const newValueString = newSelectedItems.map((i) => i.value).join(",");
    onValueChange(newValueString);
  };

  const handleSelectAll = () => {
    const allValuesString = options.map((opt) => opt.value).join(",");
    onValueChange(allValuesString);
  };

  const handleClearAll = () => {
    onValueChange("");
  };

  const renderItem = ({ item }: { item: ops }) => {
    const selected = isSelected(item);
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={styles.itemContainer}
      >
        <View
          style={[
            styles.checkbox,
            selected
              ? styles.checkboxSelected
              : isDarkMode
              ? styles.checkboxDark
              : {},
          ]}
        >
          {selected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.itemText, { color: isDarkMode ? "#E0E0E0" : "#333" }]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  // Styles for dark and light mode
  const textColor = isDarkMode ? "#E0E0E0" : "#333";
  const inputBackgroundColor = isDarkMode ? "#333333" : "#F0F0F0";
  const inputTextColor = isDarkMode ? "#FFFFFF" : "#000000";
  const borderColor = isDarkMode ? "#444" : "#ccc";

  return (
    <ModalComponent
      trigger={
        <View style={[styles.selectButton, { borderColor }]}>
          <Text style={[styles.selectButtonText, { color: textColor }]}>
            {selectedItemsArray.length > 0
              ? `${selectedItemsArray.length} std`
              : placeholder || "Select items"}
          </Text>
          <Text style={{ color: textColor }}>▼</Text>
        </View>
      }
      header={{ title: "Select Items" }}
    >
      <>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: inputBackgroundColor,
              color: inputTextColor,
              borderColor,
            },
          ]}
          placeholder="Search..."
          placeholderTextColor={isDarkMode ? "#888" : "#999"}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={styles.bulkActionsContainer}>
          <Pressable onPress={handleSelectAll} style={styles.bulkActionButton}>
            <Text style={styles.bulkActionButtonText}>Select All</Text>
          </Pressable>
          <Pressable onPress={handleClearAll} style={styles.bulkActionButton}>
            <Text style={styles.bulkActionButtonText}>Clear All</Text>
          </Pressable>
        </View>

        <FlatList
          data={filteredOptions}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: textColor }]}>
              No options found.
            </Text>
          }
        />
      </>
    </ModalComponent>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  selectButtonText: {
    fontSize: 16,
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  bulkActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  bulkActionButton: {
    paddingVertical: 8,
  },
  bulkActionButtonText: {
    color: "#007AFF",
    fontSize: 15,
    fontWeight: "600",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDark: {
    borderColor: "#4E9FDE",
  },
  checkboxSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 17,
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});

export default MultiSelectBox;
