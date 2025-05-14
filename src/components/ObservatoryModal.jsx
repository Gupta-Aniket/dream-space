import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { updateDream } from '../api/firebase';
import LinkedInput from './LinkedInput';
import MoodSelector from './MoodSelector';
import LinkedTextArea from './LinkedTextArea';

const { height } = Dimensions.get('window');

export default function ObservatoryModal({ visible, onClose, dream }) {
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMood, setEditMood] = useState('');

  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      setEditTitle(dream?.title || '');
      setEditDescription(dream?.description || '');
      setEditMood(dream?.mood || '');

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, dream]);

  const handleSave = async () => {
    if (!editTitle || !editMood) return;
    await updateDream(dream.date, editTitle, editDescription, editMood);
    onClose(true);
  };

  if (!visible) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <Animated.View
            style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.heading}>Edit Dream</Text>

            <LinkedInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Title"
              placeholderTextColor="#666"
              // style={styles.input}
            />

            <LinkedTextArea
              value={editDescription}
              onChangeText={setEditDescription}
              placeholder="Description"
              placeholderTextColor="#666"
              // style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={5}
            />

            <MoodSelector
              defaultMood={editMood}
              onSelect={setEditMood}
            />

            <View style={styles.buttonRow}>
              <Pressable onPress={handleSave} style={[styles.button, styles.saveBtn]}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable onPress={() => onClose(false)} style={[styles.button, styles.cancelBtn]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {

    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    height: "60%",
  },
  modal: {
    marginTop: 150,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
  },
  heading: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2B2B33',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  saveBtn: {
    backgroundColor: '#A78BFA',
  },
  cancelBtn: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
