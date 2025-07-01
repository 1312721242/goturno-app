import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const MapaSelector = ({ onUbicacionSeleccionada }) => {
  const [MapView, setMapView] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [region, setRegion] = useState(null);
  const [marcador, setMarcador] = useState(null);
  const [direccionTexto, setDireccionTexto] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const MapModule = require("react-native-maps");
      setMapView(() => MapModule.default);
      setMarker(() => MapModule.Marker);

      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permiso denegado", "No se puede usar la ubicación");
            setCargando(false);
            return;
          }

          const ubicacion = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = ubicacion.coords;

          const regionInicial = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setRegion(regionInicial);
          setMarcador({ latitude, longitude });
          obtenerDireccion(latitude, longitude);
        } catch (error) {
          Alert.alert("Error", "No se pudo obtener ubicación");
          console.error(error);
        } finally {
          setCargando(false);
        }
      })();
    }
  }, []);

  const obtenerDireccion = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
          },
        }
      );

      if (response.data && response.data.display_name) {
        const texto = response.data.display_name;
        setDireccionTexto(texto);
        onUbicacionSeleccionada({ latitude, longitude, direccion: texto });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const buscarDireccion = async (texto) => {
    setBusqueda(texto);
    if (texto.length < 3) {
      setSugerencias([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: texto,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
          headers: {
            "User-Agent": "ExpoApp/1.0",
            "Accept-Language": "es",
          },
        }
      );

      setSugerencias(response.data);
    } catch (error) {
      console.error("Error buscando sugerencias:", error);
    }
  };

  const seleccionarSugerencia = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const nuevaRegion = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setMarcador({ latitude: lat, longitude: lon });
    setRegion(nuevaRegion);
    setDireccionTexto(item.display_name);
    onUbicacionSeleccionada({
      latitude: lat,
      longitude: lon,
      direccion: item.display_name,
    });

    setBusqueda(item.display_name);
    setSugerencias([]);

    if (mapRef.current) {
      mapRef.current.animateToRegion(nuevaRegion, 1000);
    }
  };

  const manejarPresionMapa = (evento) => {
    const { latitude, longitude } = evento.nativeEvent.coordinate;
    setMarcador({ latitude, longitude });
    obtenerDireccion(latitude, longitude);
  };

  if (Platform.OS === "web") {
    return (
      <Text style={{ textAlign: "center", marginVertical: 10 }}>
        🌐 El mapa solo está disponible en dispositivos móviles.
      </Text>
    );
  }

  if (!MapView || !Marker || !region || cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 10 }}>Cargando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <TextInput
        style={styles.input}
        placeholder="Buscar lugar o dirección..."
        value={busqueda}
        onChangeText={buscarDireccion}
      />

      <FlatList
        nestedScrollEnabled={true}
        data={sugerencias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => seleccionarSugerencia(item)}
            style={styles.sugerencia}
          >
            <Text>{item.display_name}</Text>
          </TouchableOpacity>
        )}
      />

      <MapView
        ref={mapRef}
        style={styles.mapa}
        region={region}
        onPress={manejarPresionMapa}
      >
        {marcador && <Marker coordinate={marcador} />}
      </MapView>

      {direccionTexto ? (
        <>
          <Text style={styles.direccion}>📍 {direccionTexto}</Text>
          <TouchableOpacity
            style={styles.botonMapa}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${marcador.latitude},${marcador.longitude}`
              )
            }
          >
            <Ionicons
              name="map-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.textoBotonMapa}>Ver en Google Maps</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 10,
    borderRadius: 8,
  },
  mapa: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginTop: 8,
  },
  loader: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 44,
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 15,
    marginBottom: 4,
  },
  sugerencia: {
    padding: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  direccion: {
    padding: 6,
    fontSize: 13,
    textAlign: "center",
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  botonMapa: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  textoBotonMapa: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MapaSelector;
