import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  RefreshControl,
} from "react-native";
import axios from "../api/axiosClient";
import EncabezadoLogo from "../components/EncabezadoLogo";
import { usePreferencias } from "../hooks/usePreferencias";

const { width } = Dimensions.get("window");

const PublicHomeScreen = ({ navigation }) => {
  const [negocios, setNegocios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { modo_oscuro, ver_publicidad, ver_destacados, publicidad } = usePreferencias(); // ✅ se invoca correctamente
  console.log("ver_destacados:", ver_destacados);
  const obtenerNegocios = async () => {
    try {
      const response = await axios.get("/core/negocios", {
        params: { latitud: -0.95, longitud: -80.72, ciudad: "Manta" },
      });
      setNegocios(response.data);
    } catch (error) {
      console.error("Error al obtener negocios", error);
    }
  };

  useEffect(() => {
    obtenerNegocios();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerNegocios().then(() => setRefreshing(false));
  }, []);

  const mejores = negocios.filter((n) => n.calificacion_promedio >= 4.7);
  const restantes = negocios.filter((n) => n.calificacion_promedio < 4.7);

  const esOscuro = modo_oscuro;

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        esOscuro && { backgroundColor: "#111" }, // Fondo oscuro si aplica
      ]}
    >
      {/* Encabezado */}
      <View
        style={[
          styles.headerFijo,
          esOscuro ? styles.headerFijoDark : styles.headerFijoLight,
        ]}
      >
        <EncabezadoLogo />
      </View>


      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {ver_destacados && (
          <>
            <Text style={[styles.title, esOscuro && styles.textDark]}>
              ⭐ Destacados
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {mejores.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    navigation.navigate("DetalleNegocio", { id: item.id })
                  }
                  style={styles.carouselItem}
                >
                  <Image
                    source={{ uri: item.imagen_portada }}
                    style={styles.carouselImage}
                  />
                  <Text style={[styles.carouselText, esOscuro && styles.textDark]}>
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        {ver_publicidad && publicidad?.length > 0 && (
          <>
            <Text style={[styles.title, esOscuro && styles.textDark]}>
              🛍️ Compras
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.publicidadScroll}
            >
              {publicidad.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => item.link && Linking.openURL(item.link)}
                  style={styles.publicidadItem}
                >
                  <Image
                    source={{ uri: item.imagen_url }}
                    style={styles.publicidadImage}
                  />
                  {item.titulo && (
                    <Text
                      style={[
                        styles.publicidadTitulo,
                        esOscuro && styles.textDark,
                      ]}
                    >
                      {item.titulo}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}



        <Text style={[styles.title, esOscuro && styles.textDark]}>
          🏪 Cerca de ti
        </Text>

        {restantes.map((negocio, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, esOscuro && styles.cardDark]}
            onPress={() =>
              navigation.navigate("DetalleNegocio", { id: negocio.id })
            }
          >
            <Image
              source={{ uri: negocio.imagen_portada }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.name, esOscuro && styles.textDark]}>
                {negocio.nombre}
              </Text>
              <Text style={[styles.desc, esOscuro && styles.textLight]}>
                {negocio.descripcion}
              </Text>
              <Text style={[styles.cat, esOscuro && styles.textLight]}>
                <Text style={{ fontWeight: "bold" }}>Categoría:</Text>{" "}
                {negocio.categoria}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PublicHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerFijo: {
    zIndex: 10,
    paddingVertical: 4,
  },
  headerFijoLight: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerFijoDark: {
    backgroundColor: '#111',
    borderBottomWidth: 0,
  },

  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 15,
    marginTop: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  carouselItem: {
    marginRight: 15,
    alignItems: "center",
    width: 240,
  },
  carouselImage: {
    width: 240,
    height: 140,
    borderRadius: 10,
  },
  carouselText: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: 5,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  desc: {
    color: "#555",
  },
  cat: {
    fontStyle: "italic",
    fontSize: 12,
  },
  textDark: {
    color: "#fff",
  },
  textLight: {
    color: "#ccc",
  },
  cardDark: {
    backgroundColor: "#222",
    borderColor: "#444",
    borderWidth: 1,
    elevation: 0,
    shadowColor: "transparent",
  },
  publicidadScroll: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  publicidadItem: {
    marginRight: 12,
    alignItems: "center",
    width: 280,
  },
  publicidadImage: {
    width: 280,
    height: 120,
    borderRadius: 10,
  },
  publicidadTitulo: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
  },

});
