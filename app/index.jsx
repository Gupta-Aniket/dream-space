// app/index.jsx
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Index] checking auth…');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);

      if (user) {
        console.log('[Index] user logged in, going to tabs');
        router.replace('/(tabs)');           // landing in (tabs)/index.tsx
      } else {
        console.log('[Index] no user, going to signup');
        router.replace('/signup');     // landing in (auth)/signup.jsx
      }
    });

    return unsubscribe;
  }, []);

  // if (loading) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }
  return null;
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
