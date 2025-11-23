import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '../../store/store';
import AppNavigator from '../../navigators/navigation';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useAppStore((state) => state.user);
  const error = useAppStore((state) => state.error);
  const signIn = useAppStore((state) => state.signIn);
  const signUp = useAppStore((state) => state.signUp);

  if (user) {
    return <AppNavigator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Auth</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => signIn(email, password)} />
        <Button title="Sign Up" onPress={() => signUp(email, password)} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 12, borderRadius: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  error: { color: 'red', marginBottom: 8 },
});
