import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

const Title = ({title}:{title:string|React.ReactNode}) => {


  return (
    <View style={[styles.header]}>
      <ThemedText style={[styles.headerTitle]}>
        {title}
      </ThemedText>
      {/* <TouchableOpacity activeOpacity={0.6}>
            <Text style={[styles.headerButton, { color: "#06b031" }]}>
              Completed App.
            </Text>
          </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  headerButton: {
    fontSize: 12,
    fontFamily: "Inter-Bold",
  },
});

export default Title;
