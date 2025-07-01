import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from '../../api/axiosClient';
import { useNavigation } from '@react-navigation/native';
import MapaSelector from '../../components/MapaSelector'; // asegúrate de tener este componente

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [datos, setDatos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmar: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    direccion_referencia: '',
    latitud: '',
    longitud: '',
  });

  const [errores, setErrores] = useState({});

  const validarCampo = (campo, valor) => {
    let error = null;
    switch (campo) {
      case 'nombre':
        if (!valor.trim()) error = 'El nombre es obligatorio.';
        else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor))
          error = 'Solo letras y espacios.';
        break;
      case 'correo':
        if (!valor.trim()) error = 'El correo es obligatorio.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
          error = 'Correo no válido.';
        break;
      case 'contrasena':
        if (!valor) error = 'La contraseña es obligatoria.';
        else if (valor.length < 6)
          error = 'Debe tener al menos 6 caracteres.';
        break;
      case 'confirmar':
        if (valor !== datos.contrasena)
          error = 'Las contraseñas no coinciden.';
        break;
      case 'telefono':
        if (valor && !/^\d+$/.test(valor))
          error = 'Solo se permiten números.';
        break;
      default:
        break;
    }

    setErrores((prev) => ({ ...prev, [campo]: error }));
  };

  const handleChange = (campo, valor) => {
    setDatos((prev) => ({ ...prev, [campo]: valor }));
    validarCampo(campo, valor);
  };

  const registrar = async () => {
    Object.keys(datos).forEach((campo) => {
      validarCampo(campo, datos[campo]);
    });

    if (Object.values(errores).some((error) => error)) return;

    try {
      await axios.post('/auth/register', {
        ...datos,
        latitud: datos.latitud || null,
        longitud: datos.longitud || null,
      });

      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', error.response?.data?.error || 'No se pudo registrar');
    }
  };

  const renderInput = (
    icon,
    placeholder,
    campo,
    keyboardType = 'default',
    secure = false,
    toggleSecure = null
  ) => (
    <>
      <View
        style={[
          styles.inputGroup,
          errores[campo] ? { borderColor: 'red' } : {},
        ]}
      >
        <Ionicons name={icon} size={20} style={styles.icon} />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          value={datos[campo]}
          onChangeText={(text) => {
            let valor = text;
            if (campo === 'nombre') valor = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            if (campo === 'telefono') valor = text.replace(/\D/g, '');
            handleChange(campo, valor);
          }}
          onBlur={() => validarCampo(campo, datos[campo])}
        />
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure}>
            <Ionicons
              name={secure ? 'eye-off' : 'eye'}
              size={20}
              style={styles.iconToggle}
            />
          </TouchableOpacity>
        )}
      </View>
      {errores[campo] && <Text style={styles.error}>{errores[campo]}</Text>}
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      {renderInput('person-outline', 'Nombre completo', 'nombre')}
      {renderInput('mail-outline', 'Correo electrónico', 'correo', 'email-address')}
      {renderInput(
        'lock-closed-outline',
        'Contraseña',
        'contrasena',
        'default',
        !mostrarPassword,
        () => setMostrarPassword(!mostrarPassword)
      )}
      {renderInput(
        'shield-checkmark-outline',
        'Confirmar contraseña',
        'confirmar',
        'default',
        !mostrarConfirmar,
        () => setMostrarConfirmar(!mostrarConfirmar)
      )}
      {renderInput('call-outline', 'Teléfono', 'telefono', 'phone-pad')}
      {renderInput('business-outline', 'Ciudad', 'ciudad')}
      {renderInput('location-outline', 'Dirección', 'direccion')}
      {renderInput('pin-outline', 'Referencia', 'direccion_referencia')}

      {Platform.OS !== 'web' ? (
        <MapaSelector
          onUbicacionSeleccionada={({ latitude, longitude, direccion }) => {
            handleChange('latitud', String(latitude));
            handleChange('longitud', String(longitude));
            handleChange('direccion_referencia', direccion);
          }}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginVertical: 10 }}>
          El mapa solo está disponible en dispositivos móviles.
        </Text>
      )}

      <TouchableOpacity style={styles.boton} onPress={registrar}>
        <Ionicons name="person-add-outline" size={20} color="#fff" />
        <Text style={styles.botonTexto}>Registrarme</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 6,
    paddingHorizontal: 10,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  icon: {
    marginRight: 6,
    color: '#555',
  },
  iconToggle: {
    marginLeft: 6,
    color: '#555',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 8,
    fontSize: 13,
  },
  boton: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
    maxWidth: 400,
  },
  botonTexto: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  link: {
    color: '#3b82f6',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;
