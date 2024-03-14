import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

const API_KEY = '41150f2e82ed4266957182314240903';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [cityName, setCityName] = useState('Mumbai');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');

  useEffect(() => {
    fetchWeatherData(cityName);
    fetchForecastData(cityName);
  }, [cityName]);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`
      );
      if (!response.ok) {
        setWeatherData(null);
        return;
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log(error);
      setWeatherData(null);
    } finally {
      setLoaded(true);
    }
  }

  async function fetchForecastData(cityName) {
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=3`
      );
      if (!response.ok) {
        setForecastData(null);
        return;
      }
      const data = await response.json();
      setForecastData(data);
    } catch (error) {
      console.log(error);
      setForecastData(null);
    }
  }

  function convertTemperature(temperature) {
    if (temperatureUnit === 'Celsius') {
      return temperature;
    } else {
      return (temperature * 9) / 5 + 32;
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1593978301851-40c1849d47d4?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
        style={styles.backgroundImg}
        resizeMode="cover">
        <SearchBar fetchWeatherData={fetchWeatherData} />
        <View style={styles.unitContainer}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              temperatureUnit === 'Celsius' && styles.activeUnitButton,
            ]}
            onPress={() => setTemperatureUnit('Celsius')}>
            <Text
              style={[
                styles.unitButtonText,
                temperatureUnit === 'Celsius' && styles.activeUnitButtonText,
              ]}>
              °C
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              temperatureUnit === 'Fahrenheit' && styles.activeUnitButton,
            ]}
            onPress={() => setTemperatureUnit('Fahrenheit')}>
            <Text
              style={[
                styles.unitButtonText,
                temperatureUnit === 'Fahrenheit' && styles.activeUnitButtonText,
              ]}>
              °F
            </Text>
          </TouchableOpacity>
        </View>
        {!loaded && <ActivityIndicator color="gray" size={36} />}
        {loaded && weatherData === null && (
          <Text style={styles.primaryText}>
            City Not Found! Try Different City
          </Text>
        )}
        {weatherData && (
          <>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  ...styles.headerText,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 46,
                }}>
                {weatherData?.location?.name}
              </Text>
              <Image
                source={{ uri: `https:${weatherData.current.condition.icon}` }}
                style={{ width: 64, height: 64 }}
              />
              <Text
                style={{
                  ...styles.headerText,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                {weatherData?.current?.condition?.text}
              </Text>
              <Text style={{ ...styles.headerText, color: 'white' }}>
                {convertTemperature(weatherData?.current?.temp_c)}{' '}
                {temperatureUnit}
              </Text>
            </View>
            <View style={styles.extraInfo}>
              <View style={styles.info}>
                <Text style={{ fontSize: 22, color: 'white' }}>Humidity</Text>
                <Text style={{ fontSize: 22, color: 'white' }}>
                  {weatherData?.current?.humidity} %
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={{ fontSize: 22, color: 'white' }}>Wind Speed</Text>
                <Text style={{ fontSize: 22, color: 'white' }}>
                  {weatherData?.current?.wind_kph} km/h
                </Text>
              </View>
            </View>
          </>
        )}
        {weatherData && forecastData && (
          <View style={styles.forecastContainer}>
            {forecastData.forecast.forecastday.map((day, index) => (
              <View key={index} style={styles.forecastItem}>
                <Text style={styles.forecastDate}>{day.date}</Text>
                <Image
                  source={{ uri: `https:${day.day.condition.icon}` }}
                  style={styles.forecastIcon}
                />
                <Text style={styles.forecastTemp}>{day.day.avgtemp_c} °C</Text>
              </View>
            ))}
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const SearchBar = ({ fetchWeatherData }) => {
  const [cityName, setCityName] = useState('');

  return (
    <View style={styles.searchBar}>
      <TextInput
        placeholder="Enter City name"
        value={cityName}
        onChangeText={(text) => setCityName(text)}
      />
      <EvilIcons
        name="search"
        size={28}
        color="black"
        onPress={() => fetchWeatherData(cityName)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    margin: 20,
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
  searchBar: {
    marginTop: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width - 20,
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    backgroundColor: 'lightgray',
    borderColor: 'lightgray',
  },
  backgroundImg: {
    flex: 1,
    width: Dimensions.get('screen').width,
  },
  headerText: {
    fontSize: 36,
    marginTop: 10,
  },
  extraInfo: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    padding: 10,
  },
  info: {
    width: Dimensions.get('screen').width / 2.5,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  unitContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  unitButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },
  activeUnitButton: {
    backgroundColor: 'gray',
  },
  unitButtonText: {
    fontSize: 16,
    color: 'black',
  },
  activeUnitButtonText: {
    color: 'white',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 10,
  },
  forecastDate: {
    fontSize: 18,
    color: 'white',
  },
  forecastIcon: {
    width: 50,
    height: 50,
  },
  forecastTemp: {
    fontSize: 18,
    color: 'white',
  },
});
