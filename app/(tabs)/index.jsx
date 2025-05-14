// File: app/(tabs)/index.jsx (or wherever your screen is)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import LinkedInput from '../../src/components/LinkedInput';
import LinkedButton from '../../src/components/LinkedButton';
import LinkedTextArea from '../../src/components/LinkedTextArea';
import MoodSelector from '../../src/components/MoodSelector.jsx';
import { colors } from '../../src/constants/Colors';
import { getUserDataForToday, addDream } from '../../src/api/firebase';

export default function DreamInputScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [dataForToday, setDataForToday] = useState(null);
  const [confirmationAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const checkDataForToday = async () => {
      const data = await getUserDataForToday();
      setDataForToday(data);
    };
    checkDataForToday();
  }, []);

  const handleAddDream = async () => {
    const missingFields = !title || !mood;
    if (missingFields) {
      setShowErrors(true);
      return;
    }

    setLoading(true);
    const success = await addDream(title, description, mood);
    setLoading(false);
    // checkDataForToday();
    if (success) {
      setTitle('');
      setDescription('');
      setMood(null);
      setShowErrors(false);
      setDataForToday(true);
    // router.replace('/(tabs)/index');

      // Fade-in confirmation
      Animated.timing(confirmationAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  };

  const isInvalid = (field) => showErrors && !field;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Log your Dream</Text>
          <Text style={styles.subheader}>
            Record your dreams and their emotions
          </Text>
        </View>

        {dataForToday ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              Your dreams are kept with us, you can see them in the Observatory
            </Text>
            <Animated.Text
              style={[
                styles.confirmationText,
                { opacity: confirmationAnim },
              ]}
            >
              Your dream is added to the observatory 🌌
            </Animated.Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Title <Text style={styles.required}>*</Text>
              </Text>
              <LinkedInput
                value={title}
                onChangeText={setTitle}
                placeholder="Give your dream a name"
                style={[
                  isInvalid(title) && styles.errorOutline,
                ]}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Description
              </Text>
              <LinkedTextArea
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your dream in detail..."
                style={styles.textArea}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Mood <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.moodSelector, isInvalid(mood) && styles.errorOutline]}>
                <MoodSelector onSelect={setMood} />
              </View>
            </View>

            <LinkedButton
              title="  Save Dream  "
              onPress={handleAddDream}
              primary
              loading={loading}
              style={styles.button}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingTop: 50,
  },
  headerContainer: {
    marginBottom: 24,
    paddingLeft: 24,
  },
  header: {
    paddingTop: 24,
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    color: colors.text,
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noDataContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  noDataText: {
    color: colors.text,
    fontSize: 18,
    textAlign: 'center',
  },
  confirmationText: {
    color: colors.primary,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  textArea: {
    minHeight: 120,
  },
  errorOutline: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
    height: 56,
    borderRadius: 12,
  },
});
