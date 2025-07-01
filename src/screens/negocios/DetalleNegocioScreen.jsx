import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import axios from '../../api/axiosClient';

const DetalleNegocioScreen = ({ route, navigation }) => {
  const { negocio = null, desdeMisNegocios = false } = route.params || {};
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    if (negocio?.id) {
      axios.get(`/core/negocios/${negocio.id}`)
        .then(res => setDetalle(res.data))
        .catch(err => {
          console.error('Error al cargar el negocio', err);
          Alert.alert("Error", "No se pudo cargar la información del negocio.");
        });
    }
  }, [negocio?.id]);

  const eliminarNegocio = () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro que deseas dar de baja este negocio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          onPress: async () => {
            try {
              await axios.delete(`/core/negocios/${negocio.id}`);
              Alert.alert("Eliminado", "Negocio dado de baja correctamente");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el negocio");
            }
          },
        },
      ]
    );
  };

  if (!detalle) return <Text style={{ padding: 20 }}>Cargando...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{detalle.nombre}</Text>
      <Text>{detalle.descripcion}</Text>
      <Text>Categoría: {detalle.categoria}</Text>
      <Text>Ciudad: {detalle.ciudad}</Text>
      <Text>Dirección: {detalle.direccion}</Text>

      {desdeMisNegocios && (
        <View style={{ marginTop: 30 }}>
          <Button
            title="Editar Negocio"
            onPress={() => navigation.navigate("EditarNegocio", { negocio: detalle })}
            color="#3498db"
          />
          <View style={{ marginTop: 15 }}>
            <Button title="Dar de Baja" color="#e74c3c" onPress={eliminarNegocio} />
          </View>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DetalleNegocioScreen;
