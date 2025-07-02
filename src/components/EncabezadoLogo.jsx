// src/components/EncabezadoLogo.jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Logo from '../../assets/img/GoTurnoPequeño.png';

const EncabezadoLogo = () => {
  return (
    <View style={styles.header}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 300,
    height: 80,
  },
});

export default EncabezadoLogo;
