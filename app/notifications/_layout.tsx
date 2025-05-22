import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: true ,title:"Schedule New" }} />
      <Stack.Screen name="scheduled" options={{ headerShown: true,title:"Scheduled List" }} />
    </Stack>
  );
};

export default Layout;
