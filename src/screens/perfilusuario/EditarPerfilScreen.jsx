import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import axios from '../../api/axiosClient';
import MapaSelector from '../../components/MapaSelector';

const EditarPerfil = ({ route, navigation }) => {
  const { usuario } = route.params;

  const [nombre, setNombre] = useState(usuario.nombre || '');
  const [telefono, setTelefono] = useState(usuario.telefono || '');
  const [ciudad, setCiudad] = useState(usuario.ciudad || '');
  const [direccion, setDireccion] = useState(usuario.direccion || '');
  const [referencia, setReferencia] = useState(usuario.direccion_referencia || '');
  const [latitud, setLatitud] = useState(usuario.latitud || null);
  const [longitud, setLongitud] = useState(usuario.longitud || null);
  const [foto, setFoto] = useState(usuario.foto || null);

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!resultado.cancelled) {
      setFoto(`data:image/jpeg;base64,${resultado.base64}`);
    }
  };

  const guardarCambios = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');

      const response = await axios.put(
        `/auth/usuarios/${usuario.id}`,
        {
          nombre,
          telefono,
          ciudad,
          direccion,
          direccion_referencia: referencia,
          latitud,
          longitud,
          foto,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await SecureStore.setItemAsync('usuario', JSON.stringify(response.data.usuario));

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const manejarUbicacionSeleccionada = ({ lat, lng, referencia }) => {
    setLatitud(lat);
    setLongitud(lng);
    setReferencia(referencia);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoiding}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>

        <TouchableOpacity onPress={seleccionarImagen}>
          <Image
            source={foto ? { uri: foto } : require('../../../assets/img/Portrait_Placeholder.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>

        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} />
        <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} />
        <TextInput style={styles.input} placeholder="Referencia" value={referencia} onChangeText={setReferencia} />

        <MapaSelector
          latitud={latitud}
          longitud={longitud}
          direccionReferencia={referencia}
          onUbicacionSeleccionada={manejarUbicacionSeleccionada}
        />

        <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
          <Text style={styles.botonTexto}>Guardar cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditarPerfil;

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  botonTexto: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});
