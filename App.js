import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

//https://open-meteo.com/en/docs#weather_variable_documentation códigos e descrições

const getWeatherInfo = (code) => {
  if (code = 0) return { desc: 'Céu limpo', emoji: '☀️' };
  if (code == 1 || code == 2 || code == 3) return { desc: 'Parcialmente nublado', emoji: '⛅' };
  if (code == 45 || code == 48) return { desc: 'Neblina', emoji: '🌫️' };
  if (code == 51 || code == 53 || code == 55) return { desc: 'Chuva fraca', emoji: '🌦️' };
  if (code == 56 || code == 57) return { desc: 'Chuva congelante', emoji: '🌨️' };
  if (code == 61 || code == 63 || code == 65) return { desc: 'Chuva', emoji: '🌧️' }
  if (code == 66 || code == 67) return { desc: 'Chuva forte', emoji: '⛈️' };
  if (code == 71 || code == 73 || code == 75) return { desc: 'Neve', emoji: '❄️' };
  if (code == 77) return { desc: 'Granizo', emoji: '🌨️' };
  if (code == 80 || code == 81 || code == 82) return { desc: 'Chuva forte', emoji: '⛈️' };
  if (code == 85 || code == 86) return { desc: 'Neve forte', emoji: '❄️' };
  if (code == 95) return { desc: 'Tempestade', emoji: '⛈️' };
  if (code == 96 || code == 99) return { desc: 'Tempestade com granizo', emoji: '⛈️' };
  return { desc: 'Desconhecido', emoji: '❓' };
};

export default function App() {
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [temp, setTemp] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const buscarClima = async () => {
    try {
      // geocoding pra pegar as coordenadas da cidade
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=pt&format=json`;
      const geoResponse = await axios.get(geoUrl);
      
      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setCityName('Cidade não encontrada');
        setTemp('');
        return;
      }
      
      const { latitude, longitude, name } = geoResponse.data.results[0];
      console.log('lat:', latitude);
      console.log('long:', longitude);
      console.log('nome:', name);
      
      setLatitude(latitude.toString());
      setLongitude(longitude.toString());
      setCityName(name);
      
      // chamada da API de clima usando as coordenadas
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=America/Sao_Paulo`;
      console.log('url:', weatherUrl);
      const weatherResponse = await axios.get(weatherUrl);
      console.log('response:', weatherResponse.data);
      setTemp(weatherResponse.data.current.temperature_2m);
      
      // mapeia o código do clima pra descrição e ícone
      const weatherCode = weatherResponse.data.current.weather_code;
      const { desc, emoji } = getWeatherInfo(weatherCode);
      setDescription(desc);
      setIcon(emoji);
    } catch (error) {
      console.log('erro:', error);
      setCityName('Erro');
      setTemp('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite a cidade"
        value={city}
        onChangeText={setCity}
      />
      <Button title="Buscar" onPress={buscarClima} />
      
      {cityName ? (
        <View style={styles.resultado}>
          <Text style={styles.icon}>{icon}</Text>
          <Text>Cidade: {cityName}</Text>
          <Text>Temperatura: {temp}°C</Text>
          <Text>Descrição: {description}</Text>
        </View>
      ) : null}
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  resultado: {
    marginTop: 20,
  },
  icon: {
    fontSize: 50,
    textAlign: 'center',
  },
});
