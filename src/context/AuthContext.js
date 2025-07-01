// import React, { createContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [usuario, setUsuario] = useState(null);

//   useEffect(() => {
//     const cargarSesion = async () => {
//       const datos = await AsyncStorage.getItem("usuario");
//       if (datos) setUsuario(JSON.parse(datos));
//     };
//     cargarSesion();
//   }, []);

//   const login = async (datosUsuario) => {
//     await AsyncStorage.setItem("usuario", JSON.stringify(datosUsuario));
//     setUsuario(datosUsuario);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem("usuario");
//     setUsuario(null);
//   };

//   return (
//     <AuthContext.Provider value={{ usuario, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
