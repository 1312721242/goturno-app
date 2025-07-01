// src/screens/auth/LoginRedirectScreen.jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LoginRedirectScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Debes iniciar sesión para acceder a esta sección.</Text>
      <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default LoginRedirectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
});
