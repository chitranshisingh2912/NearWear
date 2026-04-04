import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, UrlTile } from "react-native-maps";

const shops = [
  {
    id: 1,
    name: "Zara Boutique",
    category: "Female Wear",
    rating: 4.8,
    lat: 28.6139,
    lng: 77.209,
    rent: true,
    bulk: false,
  },
  {
    id: 2,
    name: "Men's Empire",
    category: "Male Wear",
    rating: 4.5,
    lat: 28.62,
    lng: 77.215,
    rent: false,
    bulk: true,
  },
  {
    id: 3,
    name: "Fashion Hub",
    category: "Both",
    rating: 4.2,
    lat: 28.61,
    lng: 77.22,
    rent: true,
    bulk: true,
  },
  {
    id: 4,
    name: "Bulk Masters",
    category: "Bulk Orders",
    rating: 4.6,
    lat: 28.625,
    lng: 77.205,
    rent: false,
    bulk: true,
  },
  {
    id: 5,
    name: "Rent A Dress",
    category: "Female Wear",
    rating: 4.9,
    lat: 28.608,
    lng: 77.212,
    rent: true,
    bulk: false,
  },
];

export default function MapScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation({
          coords: {
            latitude: 28.6139,
            longitude: 77.209,
          },
        });
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (error) {
      setLocation({
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
        },
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color="#e94560" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>🗺️ Shops Near You</Text>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        mapType="none"
        initialRegion={{
          latitude: location?.coords?.latitude || 28.6139,
          longitude: location?.coords?.longitude || 77.209,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* CARTO Dark Tiles */}
        <UrlTile
          urlTemplate="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          maximumZ={20}
          flipY={false}
        />

        {shops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{
              latitude: shop.lat,
              longitude: shop.lng,
            }}
            onPress={() => setSelected(shop)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>🏪</Text>
            </View>

            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{shop.name}</Text>
                <Text style={styles.calloutCat}>{shop.category}</Text>
                <Text style={styles.calloutRating}>⭐ {shop.rating}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Selected Shop Card */}
      {selected && (
        <View style={styles.selectedCard}>
          <View style={styles.selectedTop}>
            <Text style={styles.selectedName}>{selected.name}</Text>

            <TouchableOpacity onPress={() => setSelected(null)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedCat}>{selected.category}</Text>
          <Text style={styles.selectedRating}>⭐ {selected.rating}</Text>

          <View style={styles.selectedBadges}>
            {selected.rent && <Text style={styles.rentBadge}>🏷️ Rent</Text>}

            {selected.bulk && <Text style={styles.bulkBadge}>📦 Bulk</Text>}
          </View>

          <TouchableOpacity
            style={styles.visitBtn}
            onPress={() => router.push("/shopdetail")}
          >
            <Text style={styles.visitBtnText}>View Shop →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Shop List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.shopList}
      >
        {shops.map((shop) => (
          <TouchableOpacity
            key={shop.id}
            style={[
              styles.shopChip,
              selected?.id === shop.id && styles.shopChipActive,
            ]}
            onPress={() => setSelected(shop)}
          >
            <Text style={styles.shopChipName}>{shop.name}</Text>
            <Text style={styles.shopChipRating}>⭐ {shop.rating}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },

  loadingBox: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#a0a0b0",
    marginTop: 16,
    fontSize: 14,
  },

  header: {
    padding: 24,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    position: "absolute",
    zIndex: 10,
    top: 0,
  },

  back: {
    color: "#e94560",
    fontSize: 16,
    backgroundColor: "#1a1a2e",
    padding: 8,
    borderRadius: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#1a1a2e",
    padding: 8,
    borderRadius: 8,
  },

  map: {
    flex: 1,
  },

  marker: {
    backgroundColor: "#e94560",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },

  markerText: {
    fontSize: 20,
  },

  callout: {
    padding: 8,
    minWidth: 120,
  },

  calloutName: {
    fontWeight: "bold",
    fontSize: 14,
  },

  calloutCat: {
    color: "#666",
    fontSize: 12,
  },

  calloutRating: {
    fontSize: 12,
    marginTop: 4,
  },

  selectedCard: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: "#16213e",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e94560",
  },

  selectedTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  selectedName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  closeBtn: {
    color: "#e94560",
    fontSize: 18,
  },

  selectedCat: {
    color: "#a0a0b0",
    fontSize: 13,
    marginBottom: 4,
  },

  selectedRating: {
    color: "#a0a0b0",
    fontSize: 13,
    marginBottom: 8,
  },

  selectedBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  rentBadge: {
    backgroundColor: "#0f3460",
    color: "#e94560",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },

  bulkBadge: {
    backgroundColor: "#0f3460",
    color: "#a0a0b0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },

  visitBtn: {
    backgroundColor: "#e94560",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  visitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  shopList: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },

  shopChip: {
    backgroundColor: "#16213e",
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#2a2a4a",
    minWidth: 130,
  },

  shopChipActive: {
    borderColor: "#e94560",
  },

  shopChipName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },

  shopChipRating: {
    color: "#a0a0b0",
    fontSize: 12,
    marginTop: 4,
  },
});
