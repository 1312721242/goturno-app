// src/screens/TestContext.jsx
import React, { createContext, useContext } from 'react';
import { View, Text } from 'react-native';

const MyContext = createContext();

const Inner = () => {
  const value = useContext(MyContext);
  return <Text>{value}</Text>;
};

export default function TestContext() {
  return (
    <MyContext.Provider value="¡Funciona useContext!">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Inner />
      </View>
    </MyContext.Provider>
  );
}
