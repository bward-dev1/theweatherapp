const weatherBtn = document.getElementById('show-weather-btn');
const resultDiv = document.getElementById('weather-result');
const cityInput = document.getElementById('city-input');

// Helper function to translate WMO codes to human words
function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Depositing Rime Fog 🌫️",
    51: "Light Drizzle 🌦️",
    53: "Moderate Drizzle 🌦️",
    55: "Dense Drizzle 🌦️",
    61: "Slight Rain 🌧️",
    63: "Moderate Rain 🌧️",
    65: "Heavy Rain 🌧️",
    71: "Slight Snow ❄️",
    73: "Moderate Snow ❄️",
    75: "Heavy Snow ❄️",
    77: "Snow Grains ❄️",
    80: "Slight Rain Showers 🌦️",
    81: "Moderate Rain Showers 🌧️",
    82: "Violent Rain Showers ⛈️",
    85: "Slight Snow Showers 🌨️",
    86: "Heavy Snow Showers 🌨️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm with Hail ⛈️",
    99: "Thunderstorm with Heavy Hail ⛈️"
  };
  return descriptions[code] || "Unknown Conditions";
}

function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city.</p>";
    return;
  }

  resultDiv.innerText = "Searching...";

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then(response => response.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) {
        resultDiv.innerHTML = "<p>City not found.</p>";
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Added 'weather_code' to the URL parameters
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code`;

      return fetch(url)
        .then(response => response.json())
        .then(weatherData => {
          const temp = weatherData.current.temperature_2m;
          const feelsLike = weatherData.current.apparent_temperature;
          // Get the description using the helper function
          const condition = getWeatherDescription(weatherData.current.weather_code);

          resultDiv.innerHTML = `
            <h3>Weather in ${name}, ${country}</h3>
            <p style="font-size: 1.2em; color: #0077cc; font-weight: bold;">${condition}</p>
            <p>Temperature: <strong>${temp}°C</strong></p>
            <p>Feels like: <strong>${feelsLike}°C</strong></p>
          `;
        });
    })
    .catch(error => {
      resultDiv.innerText = "Error loading weather.";
      console.error("Error:", error);
    });
}

weatherBtn.addEventListener('click', getWeather);

// Better 'Enter' key support
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});