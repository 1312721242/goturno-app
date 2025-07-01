import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import axios from '../../api/axiosClient';

const EditarNegocioScreen = ({ route, navigation }) => {
  const { negocio } = route.params;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (negocio) {
      setNombre(negocio.nombre || '');
      setDescripcion(negocio.descripcion || '');
      setCategoria(negocio.categoria || '');
      setCiudad(negocio.ciudad || '');
      setDireccion(negocio.direccion || '');
    }
  }, [negocio]);

  const actualizarNegocio = async () => {
    try {
      const payload = {
        nombre,
        descripcion,
        categoria,
        ciudad,
        direccion,
      };

      await axios.put(`/core/negocios/${negocio.id}`, payload);

      Alert.alert("Éxito", "Negocio actualizado correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar negocio:", error);
      Alert.alert("Error", "No se pudo actualizar el negocio.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        placeholder="Categoría"
      />

      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        value={ciudad}
        onChangeText={setCiudad}
        placeholder="Ciudad"
      />

      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Guardar Cambios" onPress={actualizarNegocio} color="#27ae60" />
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

export default EditarNegocioScreen;
