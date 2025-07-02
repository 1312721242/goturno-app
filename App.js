import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ConfiguracionProvider } from './src/context/ConfiguracionContext';

export default function App() {
  return (
    <ConfiguracionProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ConfiguracionProvider>

  );
}
