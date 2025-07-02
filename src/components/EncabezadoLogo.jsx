// EncabezadoLogo.jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import LogoClaro from '../../assets/img/GoTurnoPequeño.png';
import LogoOscuro from '../../assets/img/GoTurnoPequeñoBlanco.png';
import { usePreferencias } from '../hooks/usePreferencias';

const EncabezadoLogo = () => {
  const { modo_oscuro } = usePreferencias();

  return (
    <View style={[styles.header, modo_oscuro ? styles.headerDark : styles.headerLight]}>
      <Image
        source={modo_oscuro ? LogoOscuro : LogoClaro}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerLight: {
    backgroundColor: '#fff',
  },
  headerDark: {
    backgroundColor: '#111',
    borderBottomWidth: 0,
  },
  logo: {
    width: 300,
    height: 80,
  },
});

export default EncabezadoLogo;
