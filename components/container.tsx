import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Container = ({ children,style={padding:5,paddingTop: 10,gap:10} }: { children: React.JSX.Element,style?:any }) => {

  return (
    <SafeAreaProvider>
      <View style={[styles.container,style]}>
          {children}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
});

export default Container;
