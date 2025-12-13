import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { registerRootComponent } from 'expo';
import LoginPage from './src/screens/Auth/LoginPage';
import { AuthProvider, useAuth } from './src/screens/Auth/AuthContext';
import AppNavigator from './src/navigators/navigation';

// --- Content that uses Auth Context ---
const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If logged in → show navigation system (tabs + stacks)
  if (user) {
    return <AppNavigator />;
  }

  // If logged out → show login
  return <LoginPage />;
};

// --- Root of App ---
const App = () => {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
};

registerRootComponent(App);
