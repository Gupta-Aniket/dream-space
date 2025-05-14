import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { getMonthlyMoodCount } from '../../src/api/firebase';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

const moodLevels = {
  "Very Low": 1,
  "Low": 2,
  "Tired": 3,
  "Energetic": 4,
  "Very Energetic": 5,
};

const moodColors = {
  "Very Low": "#A83232",
  "Low": "#BF5F82",
  "Tired": "#826AB1",
  "Energetic": "#4DA6FF",
  "Very Energetic": "#8EFF82",
};

export default function Analytics() {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [moodCount, setMoodCount] = useState(null);
  const [moodTimeline, setMoodTimeline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const fetchAnalyticsData = async (month = currentMonth) => {
    setIsLoading(true);
    try {
      const result = await getMonthlyMoodCount(month);
      if (result) {
        setMoodCount(result.moodCount);
        setMoodTimeline(result.rawData);
      } else {
        setMoodCount(null);
        setMoodTimeline(null);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(selectedMonth);
  }, [selectedMonth]);

  const availableMonths = [
    currentMonth,
    '2025-04',
    '2025-03',
    '2025-02',
  ]; // Dynamically populate later

  const togglePicker = () => setIsPickerOpen(prevState => !prevState);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsPickerOpen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A78BFA" />
        <Text style={styles.loadingText}>Loading mood analytics...</Text>
      </View>
    );
  }

  if (!moodCount || !moodTimeline) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No mood data available for this month.</Text>
      </View>
    );
  }

  const pieData = Object.keys(moodCount).map(mood => ({
    name: mood,
    population: moodCount[mood],
    color: moodColors[mood] || "#999",
    legendFontColor: "#FFF",
    legendFontSize: 14,
  }));

  const lineLabels = moodTimeline.map(entry => entry.day);
  const lineData = moodTimeline.map(entry => moodLevels[entry.mood] || 0);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      {/* <View style={styles.monthPickerContainer}>
        <Text style={styles.pickerLabel}>Select Month:</Text>
        <TouchableOpacity
          style={styles.customPicker}
          onPress={togglePicker}
        >
          <Text style={styles.selectedMonthText}>{selectedMonth}</Text>
        </TouchableOpacity>

        {isPickerOpen && (
          <View style={styles.pickerOptions}>
            {availableMonths.map(month => (
              <TouchableOpacity
                key={month}
                style={styles.pickerOption}
                onPress={() => handleMonthSelect(month)}
              >
                <Text style={styles.pickerOptionText}>{month}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View> */}

      <Text style={styles.title}>Mood Distribution</Text>
      <PieChart
        data={pieData}
        width={width - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      <Text style={[styles.title, { marginTop: 30 }]}>Mood Over Time</Text>
      <LineChart
        data={{
          labels: lineLabels,
          datasets: [
            {
              data: lineData,
              strokeWidth: 2,
            },
          ],
        }}
        width={width - 40}
        height={260}
        yLabelsOffset={10}
        chartConfig={{
          ...chartConfig,
          decimalPlaces: 0,
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: '#FFF',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        fromZero
        yAxisSuffix=""
        yAxisInterval={1}
      />
    </ScrollView>
  );
}

const chartConfig = {
  backgroundColor: '#0B0B0F',
  backgroundGradientFrom: '#0B0B0F',
  backgroundGradientTo: '#0B0B0F',
  color: (opacity = 1) => `rgba(167, 139, 250, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  container: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  monthPickerContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  pickerLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 4,
  },
  customPicker: {
    color: '#FFF',
    backgroundColor: '#1A1A1F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  selectedMonthText: {
    color: '#FFF',
    fontSize: 16,
  },
  pickerOptions: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#1A1A1F',
    borderRadius: 8,
    zIndex: 10,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  pickerOptionText: {
    color: '#FFF',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 12,
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
    backgroundColor: '#0B0B0F',
    padding: 24,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});
