// Location: src/components/ObservatoryCard.jsx

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function ObservatoryCard({ title, description, mood, date, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text numberOfLines={5} ellipsizeMode="tail" style={styles.description}>
          {description}
        </Text>
      ) : null}
      <Text style={styles.mood}>🌙 {mood}</Text>
      <Text style={styles.date}>{date}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 6,
  },
  mood: {
    fontSize: 13,
    color: '#A78BFA',
  },
  date: {
    fontSize: 11,
    color: '#555',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
