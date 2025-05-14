// app/(auth)/login.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { login } from '../../src/api/firebase';
import { useRouter } from 'expo-router';
import LinkedButton from '../../src/components/LinkedButton';
import LinkedInput from '../../src/components/LinkedInput';
import { colors } from '../../src/constants/Colors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    setLoading(true);

    const { user, error } = await login(email, password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      // slight delay for smoother UX transition
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <LinkedInput
              inputType="email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              style={styles.input}
            />

            <LinkedInput
              inputType="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              style={styles.input}
            />

            {loading ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator size="small" color="#a87fff" />
              </View>
            ) : (
              <LinkedButton onPress={handleLogin} title="   Log In   " primary />
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={() => router.replace('/signup')}>
              <Text style={styles.switchText}>
                New to the app? <Text style={styles.link}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    color: colors.text,
  },
  loadingButton: {
    marginVertical: 10,
    paddingVertical: 14,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#aaa',
  },
  link: {
    color: '#a87fff',
    fontWeight: 'bold',
  },
});
