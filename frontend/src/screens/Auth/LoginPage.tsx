import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, View } from 'react-native';
import AppNavigator from '../../navigators/navigation';
import { useAppStore } from '../../store/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useAppStore((state) => state.user);
  const error = useAppStore((state) => state.error);
  const signIn = useAppStore((state) => state.signIn);
  const signUp = useAppStore((state) => state.signUp);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome</Text>

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
        <View style={styles.button}>
          <Button title="Sign In" onPress={() => signIn(email, password)} />
        </View>
        <View style={styles.button}>
          <Button title="Sign Up" onPress={() => signUp(email, password)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#1f2937',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
