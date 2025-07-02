import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen"; // <- Asegúrate de importar correctamente
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TabNavigator from "./TabNavigator";
import DetalleNegocioScreen from "../screens/negocios/DetalleNegocioScreen";
import EditarPerfilScreen from "../screens/perfilusuario/EditarPerfilScreen";
import CrearNegocioScreen from "../screens/negocios/CrearNegocioScreen";
import EditarNegocioScreen from "../screens/negocios/EditarNegocioScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Dashboard" component={TabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="DetalleNegocio"
        component={DetalleNegocioScreen}
        options={{ title: "Detalle del Negocio", headerShown: true }}
      />
      <Stack.Screen
        name="EditarPerfil"
        component={EditarPerfilScreen}
        options={{ title: "Editar Perfil", headerShown: true }}
      />
      <Stack.Screen
        name="CrearNegocio"
        component={CrearNegocioScreen}
        options={{ title: "Nuevo Negocio", headerShown: true }}
      />
      <Stack.Screen
        name="EditarNegocio"
        component={EditarNegocioScreen}
        options={{ title: "Editar Negocio", headerShown: true }}
      />
    </Stack.Navigator>
  );
}
