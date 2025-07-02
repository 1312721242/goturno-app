import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncabezadoLogo from '../../components/EncabezadoLogo';
import axiosCliente from '../../api/axiosClient';

const Configuracion = () => {
  const [config, setConfig] = useState({
    publicidad: true,
    notificaciones: true,
    filtrar_por_ciudad: true,
    ver_destacados: true,
    usar_ubicacion: true,
    modo_oscuro: false,
  });

  const obtenerToken = async () => {
    return await AsyncStorage.getItem('token');
  };

  const obtenerConfiguracion = async () => {
    try {
      const res = await axiosCliente.get('/configuraciones');
      setConfig(res.data);
    } catch (error) {
      console.error('Error al obtener configuración:', error);
    }
  };


  const actualizarConfiguracion = async (clave, valor) => {
    try {
      const nuevaConfig = { ...config, [clave]: valor };
      setConfig(nuevaConfig);

      await axiosCliente.put('/configuraciones', nuevaConfig);
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración.');
    }
  };


  useEffect(() => {
    obtenerConfiguracion();
  }, []);

  const renderSwitch = (label, description, clave) => (
    <View style={styles.optionBlock}>
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>{label}</Text>
        <Switch
          value={config[clave]}
          onValueChange={(value) => actualizarConfiguracion(clave, value)}
        />
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <EncabezadoLogo />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Preferencias de Usuario</Text>

        {renderSwitch(
          'Publicidad personalizada',
          'Muestra anuncios según tus intereses y ubicación.',
          'publicidad'
        )}

        {renderSwitch(
          'Notificaciones',
          'Recibe alertas de reservas, promociones y novedades.',
          'notificaciones'
        )}

        {renderSwitch(
          'Filtrar por ciudad',
          'Solo mostrar servicios disponibles en tu ciudad.',
          'filtrar_por_ciudad'
        )}

        {renderSwitch(
          'Ver destacados primero',
          'Prioriza negocios con mejor calificación en los resultados.',
          'ver_destacados'
        )}

        <Text style={styles.sectionTitle}>Privacidad y Apariencia</Text>

        {renderSwitch(
          'Usar mi ubicación',
          'Permite sugerencias personalizadas según tu ubicación actual.',
          'usar_ubicacion'
        )}

        {renderSwitch(
          'Modo oscuro',
          'Cambia la apariencia de la aplicación a tonos oscuros para mayor comodidad visual.',
          'modo_oscuro'
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Configuracion;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 4,
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
  },
  optionBlock: {
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
    lineHeight: 18,
  },
});
