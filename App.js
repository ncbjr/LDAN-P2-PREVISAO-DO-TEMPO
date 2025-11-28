import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

//https://open-meteo.com/en/docs#weather_variable_documentation códigos e descrições

const getWeatherInfo = (code) => {
  const numCode = Number(code);
  if (numCode == 0) return { desc: 'Céu limpo', emoji: '☀️' };
  if (numCode == 1 || numCode == 2 || numCode == 3) return { desc: 'Parcialmente nublado', emoji: '⛅' };
  if (numCode == 45 || numCode == 48) return { desc: 'Neblina', emoji: '🌫️' };
  if (numCode == 51 || numCode == 53 || numCode == 55) return { desc: 'Chuva fraca', emoji: '🌦️' };
  if (numCode == 56 || numCode == 57) return { desc: 'Chuva congelante', emoji: '🌨️' };
  if (numCode == 61 || numCode == 63 || numCode == 65) return { desc: 'Chuva', emoji: '🌧️' };
  if (numCode == 66 || numCode == 67) return { desc: 'Chuva forte', emoji: '⛈️' };
  if (numCode == 71 || numCode == 73 || numCode == 75) return { desc: 'Neve', emoji: '❄️' };
  if (numCode == 77) return { desc: 'Granizo', emoji: '🌨️' };
  if (numCode == 80 || numCode == 81 || numCode == 82) return { desc: 'Chuva forte', emoji: '⛈️' };
  if (numCode == 85 || numCode == 86) return { desc: 'Neve forte', emoji: '❄️' };
  if (numCode == 95) return { desc: 'Tempestade', emoji: '⛈️' };
  if (numCode == 96 || numCode == 99) return { desc: 'Tempestade com granizo', emoji: '⛈️' };
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
      console.log('weather code:', weatherCode);
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
