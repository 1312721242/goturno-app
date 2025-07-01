

 

 import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Image, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import axios from '../../api/axiosClient';

const PerfilScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const cargarDatos = async () => {
        setCargando(true);
        try {
          const t = await SecureStore.getItemAsync('token');
          setToken(t);

          if (t) {
            const response = await axios.get('/auth/perfil', {
              headers: { Authorization: `Bearer ${t}` }
            });
            setUsuario(response.data.usuario);
            await SecureStore.setItemAsync('usuario', JSON.stringify(response.data.usuario));
          }
        } catch (error) {
          console.error('Error cargando perfil:', error);
        } finally {
          setCargando(false);
        }
      };
      cargarDatos();
    }, [])
  );
  //  if (!usuario) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.text}>Cargando datos del usuario...</Text>
  //     </View>
  //   );
  // }

  const cerrarSesion = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('usuario');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const editarPerfil = () => {
    navigation.navigate('EditarPerfil', { usuario });
  };

  if (cargando) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#2e86de" /></View>;
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No has iniciado sesión.</Text>
        <Button title="Iniciar Sesión" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {usuario?.foto && <Image source={{ uri: usuario.foto }} style={styles.avatar} />}
      <Text style={styles.name}>{usuario?.nombre || 'Nombre no disponible'}</Text>
      <Text style={styles.email}>{usuario?.correo || 'Correo no disponible'}</Text>
      <Text style={styles.info}>Teléfono: {usuario?.telefono || '-'}</Text>
      <Text style={styles.info}>Ciudad: {usuario?.ciudad || '-'}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Editar perfil" onPress={editarPerfil} color="#2980b9" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Cerrar sesión" onPress={cerrarSesion} color="#e74c3c" />
      </View>
    </View>
  );
};

export default PerfilScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  text: { fontSize: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: 'bold' },
  email: { fontSize: 16, color: '#555' },
  info: { fontSize: 14, color: '#666', marginTop: 5 },
  buttonContainer: { width: '100%', marginTop: 15 }
});
