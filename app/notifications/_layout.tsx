import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack screenOptions={{animation:"ios_from_right"}}>
      <Stack.Screen name="index" options={{ headerShown: true ,title:"Schedule New" }} />
      <Stack.Screen name="scheduled" options={{ headerShown: true,title:"Scheduled List" }} />
      <Stack.Screen name="about" options={{ headerShown: true,title:"About App" }} />
    </Stack>
  );
};

export default Layout;
