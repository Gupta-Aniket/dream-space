import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signUp } from '../../src/api/firebase';
import { useRouter } from 'expo-router';
import CloudButton from '../../src/components/DreamCloudButton';
import DropletInput from '../../src/components/DreamDropletInput';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    const { user, error } = await signUp(email, password);

    if (error) {
      setError(error);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <DropletInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
      />
      <DropletInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
      />
      <CloudButton title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  error: { color: 'red' },
});
