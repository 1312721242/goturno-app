import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from '../api/axiosClient';

const HomeScreen = ({ navigation }) => {
  const [negocios, setNegocios] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [categoria, setCategoria] = useState('');

  const obtenerNegocios = async () => {
    try {
      const response = await axios.get('/core/negocios');
      setNegocios(response.data);
    } catch (error) {
      console.error('Error al obtener negocios:', error);
    }
  };

  useEffect(() => {
    obtenerNegocios();
  }, []);

  const negociosFiltrados = negocios.filter((n) => {
    const coincideCiudad = ciudad === '' || n.ciudad.toLowerCase().includes(ciudad.toLowerCase());
    const coincideCategoria = categoria === '' || String(n.id_categoria) === categoria;
    return coincideCiudad && coincideCategoria;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Negocios cercanos</Text>

      <View style={styles.filtros}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por ciudad"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="ID categoría"
          value={categoria}
          onChangeText={setCategoria}
        />
      </View>

      <ScrollView>
        {negociosFiltrados.map((negocio) => (
          <TouchableOpacity
            key={negocio.id}
            style={styles.card}
            onPress={() => navigation.navigate('DetalleNegocio', { id: negocio.id })}
          >
            <Text style={styles.name}>{negocio.nombre}</Text>
            <Text>{negocio.descripcion}</Text>
            <Text style={styles.meta}>Ciudad: {negocio.ciudad}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  filtros: { flexDirection: 'column', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: '600' },
  meta: { fontSize: 12, color: '#777' },
});

export default HomeScreen;
