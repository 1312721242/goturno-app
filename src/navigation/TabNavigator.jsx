// src/navigation/TabNavigator.jsx
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import PublicHomeScreen from '../screens/PublicHomeScreen';
import PerfilScreen from '../screens/perfilusuario/PerfilScreen';
import ConfiguracionScreen from '../screens/configuraciones/Configuracion';
import MisNegociosScreen from '../screens/negocios/MisNegociosScreen';
import LoginRedirectScreen from '../screens/auth/LoginRedirectScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const cargarToken = async () => {
      const t = await SecureStore.getItemAsync('token');
      setToken(t);
    };
    cargarToken();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2e86de',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = 'home-outline';
          else if (route.name === 'Mis Negocios') iconName = 'briefcase-outline';
          else if (route.name === 'Perfil') iconName = 'person-outline';
          else if (route.name === 'Configuración') iconName = 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={PublicHomeScreen} />

      {token ? (
        <Tab.Screen name="Mis Negocios" component={MisNegociosScreen} />
      ) : (
        <Tab.Screen name="Mis Negocios" component={LoginRedirectScreen} />
      )}

      {token ? (
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      ) : (
        <Tab.Screen name="Perfil" component={LoginRedirectScreen} />
      )}

      <Tab.Screen name="Configuración" component={ConfiguracionScreen} />
    </Tab.Navigator>
  );
}
