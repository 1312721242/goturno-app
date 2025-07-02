import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axiosClient";

const ConfiguracionContext = createContext();

export const ConfiguracionProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [publicidad, setPublicidad] = useState([]);

  const obtenerConfiguracion = async () => {
    try {
      const res = await axios.get("/configuraciones");
      setConfig(res.data);
    } catch (error) {
      console.error("Error al obtener configuración", error);
    }
  };

  const obtenerPublicidad = async () => {
    try {
      const res = await axios.get("/public/publicidad"); // ajusta si tu ruta es diferente
      setPublicidad(res.data);
    } catch (error) {
      console.error("Error al obtener publicidad", error);
    }
  };

  const actualizarConfiguracion = async (clave, valor) => {
    try {
      const nuevaConfig = { ...config, [clave]: valor };
      setConfig(nuevaConfig);
      await axios.put("/configuraciones", nuevaConfig);
    } catch (error) {
      console.error("Error al actualizar configuración", error);
    }
  };

  useEffect(() => {
    obtenerConfiguracion();
    obtenerPublicidad();
  }, []);

  return (
    <ConfiguracionContext.Provider
      value={{
        config,
        publicidad,
        actualizarConfiguracion,
      }}
    >
      {children}
    </ConfiguracionContext.Provider>
  );
};

export const useConfiguracion = () => useContext(ConfiguracionContext);
