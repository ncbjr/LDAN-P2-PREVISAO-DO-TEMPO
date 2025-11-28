import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {cityName ? (
        <View style={styles.card}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.cityInfo}>{cityName} | {description}</Text>
          <Text style={styles.temp}>{temp}°C</Text>
        </View>
      ) : null}
      
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite a cidade"
          value={city}
          onChangeText={setCity}
        />
        <View style={styles.buttonContainer}>
          <Button title="Buscar" onPress={buscarClima} color="#1976d2" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  buscaContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: '#1976d2',
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 30,
    margin: 20,
    marginTop: 50,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    fontSize: 60,
    marginBottom: 15,
  },
  cityInfo: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  temp: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
