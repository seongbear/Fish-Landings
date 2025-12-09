import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BackgroundProps {
  children?: ReactNode;
  disableTopEdge?: boolean;
}

export default function Background({ children, disableTopEdge }: BackgroundProps) {
  return (
    <SafeAreaView style={styles.container} edges={disableTopEdge ? ['left', 'right', 'bottom'] : ['top', 'left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dce9f5', // your background color
  },
});
