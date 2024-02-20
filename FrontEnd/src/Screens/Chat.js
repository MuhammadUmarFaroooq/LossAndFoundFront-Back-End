import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import GetLocation from 'react-native-get-location';

const Chat = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'ItemSync needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
        } else {
          Alert.alert('Please Allow Location');
          console.warn('Location permission denied');
        }
      } else if (Platform.OS === 'ios') {
        await GetLocation.requestPermissions({ios: {enableHighAccuracy: true}});
        setPermissionGranted(true); // Assuming permission is granted on iOS
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      if (!permissionGranted) {
        Alert.alert(
          'Location Required',
          'Please grant location permission to use this feature.',
        );
        return; // Exit if permission is still denied after prompting
      }

      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.warn('Error getting current location:', error);
    }
  };

  const handleMapPress = event => {
    if (!permissionGranted) {
      Alert.alert(
        'Location Required',
        'Please grant location permission to use this feature.',
      );
      return;
    }

    const {coordinate} = event.nativeEvent;
    setSelectedLocation(coordinate);
    console.log('Selected Location:', coordinate);
  };

  const handleMarkerDrag = coordinate => {
    setSelectedLocation(coordinate);
  };

  const openMap = () => {
    setIsMapVisible(true);
  };

  const closeMap = () => {
    setIsMapVisible(false);
  };

  const initialRegion = {
    latitude: 32.18825, // Default latitude
    longitude: 74.1324, // Default longitude
    latitudeDelta: 1.015,
    longitudeDelta: 1.0121,
  };

  return (
    <View>
      <TouchableOpacity onPress={openMap}>
        <View style={styles.field}>
          <Text>Location</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isMapVisible} animationType="slide">
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: selectedLocation ? selectedLocation.latitude : 32.18825,
              longitude: selectedLocation
                ? selectedLocation.longitude
                : 74.1324,
              latitudeDelta: 1.015,
              longitudeDelta: 1.0121,
            }}
            onPress={handleMapPress}>
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                draggable
                onDragEnd={e => handleMarkerDrag(e.nativeEvent.coordinate)}
              />
            )}
            <Circle
              center={{latitude: 32.1877, longitude: 74.1945}}
              radius={500}
              strokeColor="#2a2b2b"
              fillColor="#b2ebe9"
            />
          </MapView>
          <TouchableOpacity onPress={closeMap} style={styles.closeButton}>
            <Text>Close Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={getCurrentLocation}
            style={styles.currentLocationButton}>
            <Text>Current Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  field: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    margin: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
  },
});
