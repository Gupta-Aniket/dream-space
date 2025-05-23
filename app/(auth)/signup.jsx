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
import { signUp } from '../../src/api/firebase';
import { useRouter } from 'expo-router';
import LinkedButton from '../../src/components/LinkedButton';
import LinkedInput from '../../src/components/LinkedInput';
import { colors } from '../../src/constants/Colors';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    const { user, error: signUpError } = await signUp(name, email, password, name);
    setLoading(false);

    if (signUpError) {
      setError(signUpError);
    } else {
      router.replace('/(tabs)/index');
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
            <Text style={styles.title}>Sign Up</Text>

            <LinkedInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              style={styles.input}
            />

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

            <LinkedButton
              onPress={handleSignUp}
              title={loading ? '' : '   Sign Up   '}
              primary
              disabled={loading}
            >
              {loading && <ActivityIndicator color="white" />}
            </LinkedButton>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.switchText}>
                Already a user? <Text style={styles.link}>Log in</Text>
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
