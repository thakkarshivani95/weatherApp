import React, { useState, useEffect } from 'react';
import './App.css';

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
}

function App() {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3001/weather?location=${encodeURIComponent(location)}`);
      if (response.ok) {
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } else {
        setError('Weather data not found. Please check the location and try again.');
        console.error('Network response was not ok.');
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setError('There was an error fetching weather data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <h1 className="title">Weather App</h1>
      <div className="input-container">
        <input
          className="input"
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className="button" onClick={getWeather}>
          Get Weather
        </button>
      </div>
      {weatherData && (
        <div className="weather-info">
          <h2>Weather in {location}:</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Condition: {weatherData.weather[0].description}</p>
        </div>
      )}
      <div className="time-info">
        <h2>Current Time:</h2>
        <p>{currentTime}</p>
      </div>
    </div>
  );
}

export default App;
