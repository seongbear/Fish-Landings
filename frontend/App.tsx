import React, { useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import { AuthProvider, useAuth } from './src/screens/Auth/AuthContext';
import AppNavigator from './src/navigators/navigation';
import SplashScreen from './src/screens/Auth/screen/SplashScreen';
import LoginPage from './src/screens/Auth/screen/LoginPage';

// --- Content that uses Auth Context ---
const AppLayout = () => {
  const { user, loading } = useAuth();
  const [isSplashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    // Force the splash screen to stay visible for at least 2 seconds
    // This prevents a "flicker" if auth loads too fast
    const timer = setTimeout(() => {
      setSplashAnimationFinished(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !isSplashAnimationFinished) {
    return (
      <SplashScreen />
    );
  }

  return <AppNavigator />;
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
