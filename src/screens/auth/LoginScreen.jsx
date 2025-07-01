import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from '../../api/axiosClient'; // Asegúrate de tener configurado axiosClient
import Logo from '../../../assets/img/GoTurnoPequeño.png'; // Asegúrate de que la ruta sea correcta

const LoginScreen = () => {
  const navigation = useNavigation();
  const isWeb = Platform.OS === 'web';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState({});

  const validar = () => {
    const erroresVal = {};
    if (!email.trim()) erroresVal.email = 'Correo requerido.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      erroresVal.email = 'Correo inválido.';
    if (!password) erroresVal.password = 'Contraseña requerida.';
    setErrores(erroresVal);
    return Object.keys(erroresVal).length === 0;
  };

  const iniciarSesion = async () => {
  if (!validar()) return;

  try {
    const response = await axios.post('/auth/login', {
      correo: email,
      contrasena: password,
    });

    const { token, usuario } = response.data;

    if (Platform.OS === 'web') {
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      const SecureStore = require('expo-secure-store');
      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('usuario', JSON.stringify(usuario)); // 👈 ESTA LÍNEA FALTABA
    }

    navigation.replace('Dashboard');
  } catch (error) {
    console.error('Error al iniciar sesión', error);
    Alert.alert('Error', 'Credenciales incorrectas o servidor no disponible');
  }
};


  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.form}>
        <View style={[styles.inputGroup, errores.email && styles.inputError]}>
          <Ionicons name="mail-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => {
              setEmail(text);
              if (errores.email) setErrores({ ...errores, email: null });
            }}
            value={email}
            onBlur={validar}
          />
        </View>
        {errores.email && <Text style={styles.error}>{errores.email}</Text>}

        <View style={[styles.inputGroup, errores.password && styles.inputError]}>
          <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!mostrarPassword}
            onChangeText={(text) => {
              setPassword(text);
              if (errores.password) setErrores({ ...errores, password: null });
            }}
            value={password}
            onBlur={validar}
          />
          <TouchableOpacity onPress={() => setMostrarPassword(!mostrarPassword)}>
            <Ionicons
              name={mostrarPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>
        {errores.password && <Text style={styles.error}>{errores.password}</Text>}

        <TouchableOpacity style={styles.loginButton} onPress={iniciarSesion}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.dividerText}>o inicia sesión con</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-apple" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Registrar')}>
          <Text style={styles.link}>¿No tienes cuenta? Crear una</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 400 : '100%',
  },
  logo: {
    width: 260,
    height: 200,
    marginBottom: 10,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 8,
    fontSize: 13,
  },
  loginButton: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  dividerText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 20,
  },
  socialIcon: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
    elevation: 2,
    marginHorizontal: 8,
  },
  link: {
    textAlign: 'center',
    color: '#2980b9',
    marginTop: 8,
  },
});

export default LoginScreen;
