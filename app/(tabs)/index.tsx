import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Index = () => {
  const router = useRouter();

  const isDarkMode = useColorScheme();

  return (
    <View style={styles.container}>
      
      <MaterialIcons name='library-books' size={150} color={isDarkMode ? '#fff' : '#000'} />

      <ThemedText style={[styles.title,{paddingTop:14}]}>Welcome</ThemedText>
      <ThemedText style={styles.title}>to VacabBuilder</ThemedText>
      <ThemedText style={styles.subtitle}>
        Build your vocabulary easily with fun and interactive ways!
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Index;
