import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "../../api/axiosClient";
import * as SecureStore from "expo-secure-store";
import EncabezadoLogo from "../../components/EncabezadoLogo";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import { useConfiguracion } from "../../context/ConfiguracionContext"; // 💡 Importa el contexto

const MisNegociosScreen = () => {
  const [negocios, setNegocios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();
  const { config } = useConfiguracion(); // 💡 Obtiene la configuración global
  const esOscuro = config?.modo_oscuro;

  useEffect(() => {
    const cargarToken = async () => {
      const t = await SecureStore.getItemAsync("token");
      setToken(t);
    };
    cargarToken();
  }, []);

  useEffect(() => {
    const obtenerMisNegocios = async () => {
      try {
        const response = await axios.get("/core/mis-negocios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNegocios(response.data);
      } catch (error) {
        console.error("Error al obtener negocios:", error);
      } finally {
        setCargando(false);
      }
    };

    if (token) {
      obtenerMisNegocios();
    }
  }, [token]);

  const renderNegocio = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, esOscuro && styles.cardDark]}
      onPress={() =>
        navigation.navigate("DetalleNegocio", {
          negocio: item,
          editable: true,
        })
      }
    >
      <Image
        source={
          item.imagen_portada
            ? { uri: item.imagen_portada }
            : require("../../../assets/img/negocio_placeholder.png")
        }
        style={styles.imagen}
      />
      <View style={styles.info}>
        <Text style={[styles.nombre, esOscuro && styles.textLight]}>
          {item.nombre}
        </Text>
        <Text style={[styles.descripcion, esOscuro && styles.textLight]}>
          {item.descripcion}
        </Text>
        <Text style={[styles.categoria, esOscuro && styles.textLight]}>
          Categoría: {item.categoria || "Sin categoría"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!token) {
    return (
      <ScrollView contentContainerStyle={[styles.center, esOscuro && styles.bgDark]}>
        <EncabezadoLogo />
        <Text style={[styles.loginText, esOscuro && styles.textLight]}>
          Debes iniciar sesión para ver tus negocios.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (cargando) {
    return (
      <ScrollView contentContainerStyle={[styles.center, esOscuro && styles.bgDark]}>
        <EncabezadoLogo />
        <Text style={[styles.textLight, { marginTop: 20 }]}>
          Cargando tus negocios...
        </Text>
      </ScrollView>
    );
  }

  return (
    <View style={[{ flex: 1 }, esOscuro && styles.bgDark]}>
      <View style={{ marginTop: 30 }}>
        <EncabezadoLogo />
      </View>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate("CrearNegocio")}
      >
        <AntDesign name="pluscircle" size={50} color="#27ae60" />
      </TouchableOpacity>

      {negocios.length === 0 ? (
        <View style={[styles.center, esOscuro && styles.bgDark]}>
          <Text style={[styles.textLight, { marginTop: 20 }]}>
            No tienes negocios registrados aún.
          </Text>
        </View>
      ) : (
        <FlatList
          data={negocios}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNegocio}
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
    borderColor: "#eee",
    borderWidth: 1,
  },
  cardDark: {
    backgroundColor: "#222",
    borderColor: "#444",
    elevation: 0,
  },
  imagen: {
    width: 100,
    height: 100,
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  descripcion: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  categoria: {
    fontSize: 13,
    color: "#999",
    marginTop: 6,
    fontStyle: "italic",
  },
  textLight: {
    color: "#eee",
  },
  bgDark: {
    backgroundColor: "#111",
  },
  loginText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  botonAgregar: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});

export default MisNegociosScreen;
