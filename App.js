import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios';

export default function App() {
  const [cityName, setCityName] = useState('');
  const [temp, setTemp] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    buscarClima();
  }, []);

  const buscarClima = async () => {
    try {
      // geocoding pra pegar as coordenadas da cidade
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=Maricá&count=1&language=pt&format=json`;
      const geoResponse = await axios.get(geoUrl);
      
      const { latitude, longitude, name } = geoResponse.data.results[0];
      console.log('lat:', latitude);
      console.log('long:', longitude);
      console.log('nome:', name);
      
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());
      setCityName(name);
      
      // chamada da API de clima usando as coordenadas
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=America/Sao_Paulo`;
      console.log('url:', weatherUrl);
      const weatherResponse = await axios.get(weatherUrl);
      console.log('response:', weatherResponse.data);
      setTemp(weatherResponse.data.temperature); 
      // não ta funcionando
    } catch (error) {
      console.log('erro:', error);
      setCityName('Erro');
      setTemp('');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Cidade: {cityName}</Text>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
      <Text>Temperatura: {temp}°C</Text>
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
