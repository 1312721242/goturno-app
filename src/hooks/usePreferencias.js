// src/hooks/usePreferencias.js
import { useConfiguracion } from '../context/ConfiguracionContext';

export const usePreferencias = () => {
  const { config, publicidad, actualizarConfiguracion } = useConfiguracion();

  const {
    modo_oscuro = false,
    ver_publicidad = true,
    notificaciones = true,
    ver_destacados = true,
    filtrar_por_ciudad = false,
    usar_ubicacion = true,
  } = config || {};

  return {
    config,
    actualizarConfiguracion,
    publicidad,
    modo_oscuro,
    ver_publicidad,
    notificaciones,
    ver_destacados,
    filtrar_por_ciudad,
    usar_ubicacion,
  };
};
