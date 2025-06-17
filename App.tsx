import { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { styles } from "./styles";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

      /* console.log("Localização Atual:", {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      }); */
    }
  }

  async function handleOpenDeviceMap() {
    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const currentPosition = await getCurrentPositionAsync();
    const { latitude, longitude } = currentPosition.coords;
    const latLgn = `${latitude},${longitude}`;
    const label = "Você está aqui";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLgn}`,
      android: `${scheme}${latLgn}(${label})`,
    });
    if (!url) {
      return Alert.alert("Ops, Não foi possivel abrir o mapa.");
    }
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      return Alert.alert("Ops, Não foi possivel abrir o mapa.");
    }
    Linking.openURL(url);
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (newLocation) => {
        setLocation(newLocation);
        mapRef.current?.animateCamera({
          pitch: 0,
          center: newLocation.coords,
        });
        //console.log("Nova Localização:", newLocation);
      }
    );
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Você está aqui"
            description="Sua localização atual"
          />
        </MapView>
      )}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleOpenDeviceMap}
      >
        <Text style={styles.buttonTitle}>Como chegar</Text>
      </TouchableOpacity>
    </View>
  );
}
