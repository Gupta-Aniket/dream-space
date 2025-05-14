// Location: app/(tabs)/observatory.jsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getAllDreams } from '../../src/api/firebase';
import ObservatoryCard from '../../src/components/ObservatoryCards';
import ObservatoryModal from '../../src/components/ObservatoryModal';

export default function Observatory() {
  const [dreams, setDreams] = useState(null); // null = loading, [] = no data
  const [selectedDream, setSelectedDream] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchDreams = async () => {
    const result = await getAllDreams();
    setDreams(result.length === 0 ? [] : result);
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  if (dreams === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={styles.loadingText}>Loading dreams from the stars...</Text>
      </View>
    );
  }

  if (dreams.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No dreams yet. Start by creating your first dream log.</Text>
      </View>
    );
  }

  const entries = Object.entries(dreams).reverse(); // show latest first

  const openModal = (dream) => {
    setSelectedDream(dream);
    setTimeout(() => setModalVisible(true), 100);
    // setModalVisible(true);
  };

  return (
    <>
      <View>
        <Text  style={styles.header}>
          Observatory
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid}>
        {entries.map(([date, dream]) => (
          <ObservatoryCard
            key={date}
            title={dream.title}
            description={dream.description}
            mood={dream.mood}
            date={date}
            onPress={() =>
              openModal({ ...dream, date })
            }
          />
        ))}
      </ScrollView>

      <ObservatoryModal
        visible={modalVisible}
        dream={selectedDream}
        onClose={(didSave) => {
          setModalVisible(false);
          if (didSave) {
            fetchDreams();
          }
        }}
      />
    </>
  );
}


const styles = StyleSheet.create({
  header:{
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 24,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B0B0F',
  },
  loadingText: {
    color: '#CCC',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B0B0F',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
});
