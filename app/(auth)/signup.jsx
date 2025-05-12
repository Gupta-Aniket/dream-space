import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signUp } from '../../src/api/firebase';
import { useRouter } from 'expo-router';
import CloudButton from '../../src/components/DreamCloudButton';
import DropletInput from '../../src/components/DreamDropletInput';
import { colors } from '../../src/constants/Colors';
import LinkedButton from '../../src/components/LinkedButton';




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
          inputStyle={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <DropletInput
          inputStyle={styles.input}

          value={password}
          onChangeText={setPassword}
          placeholder="Password"
        />
        <LinkedButton onPress={handleSignUp} title="Sign Up" />
      </View>


  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, color: colors.text },
  error: { color: 'red' },
});
