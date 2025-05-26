import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Image, ScrollView, StyleSheet } from "react-native";

const AboutUsScreen = () => {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/about_us.png")} // Replace with your app icon path
          style={{width:"100%",height:"100%",resizeMode:"contain"}}
        />
      }
    >
      <ScrollView contentContainerStyle={styles.container}>

        <ThemedText style={styles.title}>About Vocabulary Builder</ThemedText>
        <ThemedText style={styles.paragraph}>
          Vocabulary Builder is a learning tool designed to improve your English
          vocabulary through random word notifications, scheduled notification, and
          interactive word forms. Perfect for daily learners.
        </ThemedText>

        <ThemedText style={styles.sectionTitle}>Features:</ThemedText>
        <ThemedText style={styles.listItem}>
          • Word of the day with example and forms which you set
        </ThemedText>
        <ThemedText style={styles.listItem}>• Customizable learning intervals</ThemedText>
        <ThemedText style={styles.listItem}>
          • Background and scheduled notifications
        </ThemedText>
        <ThemedText style={styles.listItem}>• Lightweight and offline support</ThemedText>

        <ThemedText style={styles.sectionTitle}>About the Developer</ThemedText>
        <ThemedText style={styles.paragraph}>
          Hi, I’m Meraj Alam — a passionate mobile developer with a focus on
          building practical and user-friendly applications using React Native
          and Android. I love crafting apps that make learning fun and
          efficient.
        </ThemedText>

        <ExternalLink href="https://github.com/merajcode" style={styles.contact}>🌐 GitHub: github.com/merajcode</ExternalLink>
      </ScrollView>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  container: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 6,
  },
  contact: {
    fontSize: 15,
    marginTop: 8,
    color: "#007AFF",
  },
});

export default AboutUsScreen;
