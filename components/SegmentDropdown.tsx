import { translateLang } from "@/utils/staticData";
import { DTheme, LTheme } from "@/utils/themeColors";
import React from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import SelectBox from "./Form/SelectBox";

const SegmentDropdown = ({
  type,
  setType,
}: {
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DTheme : LTheme;

  return (
    <View style={[styles.container,{backgroundColor:theme.colors.background,borderColor:theme.colors.outline}]}>
      <Text style={[styles.label,{color:theme.colors.onSurface}]}>Translate To</Text>
      <View style={{ width: '50%' }}>
        <SelectBox
          onValueChange={setType}
          selectedValue={type}
          placeholder="Select Type"
          options={translateLang}
          style={{ borderWidth: 0, borderLeftWidth: 1, borderRadius: 0,paddingVertical:8,backgroundColor:theme.colors.secondaryContainer }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Label and dropdown side by side
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth:1,
    borderRadius:16,
    overflow:"hidden",
    paddingLeft:5,
    width: '100%'
  },
  label: {
    width: '50%',
    fontSize: 15,
    textAlign:"center",
    fontWeight:"bold"
  },
});

export default SegmentDropdown;
