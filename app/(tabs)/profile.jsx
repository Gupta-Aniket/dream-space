import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { getMonthlyMoodCount } from '../../src/api/firebase';
import { format, startOfMonth, endOfMonth, getDate, getDay } from 'date-fns';
import LinkedButton from '@/src/components/LinkedButton';
import { logout } from '../../src/api/firebase'; // Import logout function

const { width } = Dimensions.get('window');
const CELL_SIZE = width / 7;

export default function Profile() {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = async () => {
    const result = await getMonthlyMoodCount();
    setMoodData(result?.rawData || []);
    setLoading(false);
  };

  const today = new Date();
  const yearMonth = format(today, 'MMMM yyyy'); // Ex: "May 2025"
  const start = startOfMonth(today);
  const end = endOfMonth(today);

  const moodDays = new Set(moodData.map(item => Number(item.day)));

  // Calculate calendar rows and days
  const firstDayOfMonth = getDay(start); // 0 (Sun) – 6 (Sat)
  const daysInMonth = getDate(end); // Number of days in month
  
  // Create the calendar grid
  const renderCalendar = () => {
    const calendarRows = [];
    let days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <View key={`empty-start-${i}`} style={styles.cell} />
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const hasMood = moodDays.has(day);
      days.push(
        <View key={`day-${day}`} style={styles.cell}>
          <Text style={[styles.dayText, hasMood && styles.moodDay]}>
            {hasMood ? '🌙' : day}
          </Text>
        </View>
      );
      
      // When we reach Saturday (or filled a row), create a new row
      if ((firstDayOfMonth + day) % 7 === 0) {
        calendarRows.push(
          <View key={`row-${calendarRows.length}`} style={styles.row}>
            {days}
          </View>
        );
        days = [];
      }
    }
    
    // Add empty cells for days after the last day of month
    const remainingCells = 7 - days.length;
    if (days.length > 0) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(
          <View key={`empty-end-${i}`} style={styles.cell} />
        );
      }
      
      // Add the last row
      calendarRows.push(
        <View key={`row-${calendarRows.length}`} style={styles.row}>
          {days}
        </View>
      );
    }
    
    return calendarRows;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.monthText}>{yearMonth}</Text>

      <View style={styles.weekdaysRow}>
        <Text style={styles.weekdayText}>Sun</Text>
        <Text style={styles.weekdayText}>Mon</Text>
        <Text style={styles.weekdayText}>Tue</Text>
        <Text style={styles.weekdayText}>Wed</Text>
        <Text style={styles.weekdayText}>Thu</Text>
        <Text style={styles.weekdayText}>Fri</Text>
        <Text style={styles.weekdayText}>Sat</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#A78BFA" style={{ marginTop: 32 }} />
      ) : (
        <>
          <View style={styles.calendarContainer}>
            {renderCalendar()}
          </View>

          <LinkedButton
            style={{ marginTop: 102 }}
            title="Log Out"
            onPress={async () => {
              const result = await logout();
              if (result.success) {
                
                // Handle any other actions you need after logout, like redirecting to the login screen
              } else {
                // Handle error if necessary
              }
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Transparent background
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 24,
    paddingTop: 24,
    paddingBottom: 80,
  },
  monthText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayText: {
    fontSize: 14,
    color: '#fff',
    width: CELL_SIZE,
    textAlign: 'center',
  },
  calendarContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 18,
    color: '#fff',
  },
  moodDay: {
    color: '#A78BFA', // Purple color for days with mood
  },
});
