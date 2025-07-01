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
// import EncabezadoLogo from '../../components/EncabezadoLogo'; // Reutilizable

const { width } = Dimensions.get("window");

const PublicHomeScreen = ({ navigation }) => {
  const [negocios, setNegocios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>⭐ Negocios Destacados</Text>
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
              <Text style={styles.carouselText}>{item.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.subtitle}>Negocios Cercanos</Text>
        {restantes.map((negocio, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("DetalleNegocio", { id: negocio.id })
            }
          >
            <Image
              source={{ uri: negocio.imagen_portada }}
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{negocio.nombre}</Text>
              <Text style={styles.desc}>{negocio.descripcion}</Text>
              <Text style={styles.cat}>
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
  container: { flex: 1, backgroundColor: "#f6f6f6" },
  title: { fontSize: 22, fontWeight: "bold", padding: 15 },
  subtitle: { fontSize: 18, fontWeight: "bold", padding: 15, marginTop: 20 },
  horizontalScroll: { paddingHorizontal: 10, paddingBottom: 10 },
  carouselItem: { marginRight: 15, alignItems: "center", width: 240 },
  carouselImage: { width: 240, height: 140, borderRadius: 10 },
  carouselText: { textAlign: "center", fontWeight: "600", marginTop: 5 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
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
  cardContent: { flex: 1, padding: 10, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "bold" },
  desc: { color: "#555" },
  cat: { fontStyle: "italic", fontSize: 12 },
});
