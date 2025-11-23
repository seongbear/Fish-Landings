import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAppStore } from '../../../../store/store';


export default function ProfilePage() {
  const signOutUser = useAppStore((state) => state.signOutUser);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>
      <Button title="Sign Out" onPress={signOutUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});
