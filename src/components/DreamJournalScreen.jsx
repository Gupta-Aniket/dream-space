// src/screens/DreamJournalScreen.jsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import DreamCloudButton from '../components/DreamCloudButton';
import DreamDropletInput from '../components/DreamDropletInput';

export default function DreamJournalScreen() {
  const [dreamTitle, setDreamTitle] = useState('');
  const [dreamDescription, setDreamDescription] = useState('');

  const dreamPalette = ['#9C27B0', '#673AB7', '#3F51B5'];

  const handleSaveDream = () => {
    // Implement dream saving logic
    console.log('Saving dream:', { title: dreamTitle, description: dreamDescription });
    // You might want to add navigation, storage, or API call here
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.screenTitle}>Dream Journal</Text>
      
      <DreamDropletInput 
        value={dreamTitle}
        onChangeText={setDreamTitle}
        placeholder="Dream Title"
        colors={dreamPalette}
      />
      
      <DreamDropletInput 
        value={dreamDescription}
        onChangeText={setDreamDescription}
        placeholder="Describe your dream..."
        colors={dreamPalette}
      />
      
      <DreamCloudButton 
        title="Save Dream" 
        onPress={handleSaveDream}
        colors={dreamPalette}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Light purple background
  },
  content: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#673AB7',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
});