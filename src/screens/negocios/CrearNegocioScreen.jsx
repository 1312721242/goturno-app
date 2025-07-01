import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import axios from '../../api/axiosClient';
import * as SecureStore from 'expo-secure-store';

const CrearNegocioScreen = ({ navigation }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');

  const crearNegocio = async () => {
    if (!nombre || !descripcion || !ciudad || !direccion) {
      Alert.alert('Campos requeridos', 'Por favor llena todos los campos obligatorios.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');
      const payload = { nombre, descripcion, categoria, ciudad, direccion };

      await axios.post('/core/negocios', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Alert.alert('Éxito', 'Negocio creado correctamente.');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear el negocio:', error);
      Alert.alert('Error', 'No se pudo crear el negocio.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Negocio</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del negocio"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        multiline
      />

      <Text style={styles.label}>Categoría</Text>
      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ej: Barbería, Estética, Spa"
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={ciudad}
        onChangeText={setCiudad}
        placeholder="Ciudad donde está ubicado"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección exacta"
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Crear Negocio" onPress={crearNegocio} color="#27ae60" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
});

export default CrearNegocioScreen;
