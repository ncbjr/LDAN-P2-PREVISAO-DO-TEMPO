import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

export default function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    buscarCoordenadas();
  }, []);

  const buscarCoordenadas = async () => {
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=Maricá&count=1&language=pt&format=json`;
      const geoResponse = await axios.get(geoUrl);
      
      const { latitude: lat, longitude: lon } = geoResponse.data.results[0];
      
      setLatitude(lat.toString());
      setLongitude(lon.toString());
    } catch (error) {
      console.log('erro:', error);
      setLatitude('Erro');
      setLongitude('Erro');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
});
