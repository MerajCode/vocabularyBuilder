import { DTheme, LTheme } from "@/utils/themeColors";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableHighlight, useColorScheme, View, ViewStyle } from "react-native";

interface ops {
  value: string;
  label: string;
}

interface props {
  options: ops[];
  selectedValue: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  style?: ViewStyle;
}

const SelectBox = ({ options, selectedValue, onValueChange, placeholder,style }: props) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark"? DTheme:LTheme;

  const pickerRef = useRef<Picker<string>>(null);
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(selectedValue);
  }, [selectedValue]);

  return (
    <View>
      <TouchableHighlight
        underlayColor="transparent" // ← yeh important hai
        onPress={() => pickerRef.current?.focus()}
      >
        <View
          style={[{
            borderWidth: 1,
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.background,
            borderRadius: 13,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 14,
          },style]}
        >
          <Text style={{ color: theme.colors.onSurface }}>
            {value.length > 6 ? `${value?.slice(0, 6)}...` : (value || placeholder)}
          </Text>
          <AntDesign
            name="caretdown"
            size={14}
            color={theme.colors.onSurface}
          />
        </View>
      </TouchableHighlight>
      <Picker
        ref={pickerRef}
        selectedValue={value}
        onValueChange={onValueChange}
        style={{
          height: 40,
          display: "none",
        }}
      >
        {options.map((item, key) => (
          <Picker.Item key={key} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

export default SelectBox;
