// Grab elements from the page //
const loadBtn = document.getElementById("loadBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const tempEl = document.getElementById("temp");
const feelsEl = document.getElementById("feels");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const conditionEl = document.getElementById("condition");

// API URL // request current weather data //
const API_URL =
  "https://api.open-meteo.com/v1/forecast?" +
  "latitude=27.9506&longitude=-82.4572" +
  "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code" +
  "&temperature_unit=fahrenheit" +
  "&wind_speed_unit=mph";

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Foggy 🌫️",
    48: "Depositing rime fog 🌫️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌦️",
    55: "Dense drizzle 🌧️",
    61: "Slight rain 🌧️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain 🌧️",
    71: "Slight snow 🌨️",
    73: "Moderate snow 🌨️",
    75: "Heavy snow 🌨️",
    80: "Slight rain showers 🌦️",
    81: "Moderate rain showers 🌧️",
    82: "Violent rain showers ⛈️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm with slight hail ⛈️",
    99: "Thunderstorm with heavy hail ⛈️",
  };
  return descriptions[code] || `Code ${code}`;
}

loadBtn.addEventListener("click", async function () { // Fetch weather when button is clicked //
  // Show loading state
  loadBtn.disabled = true;
  loadBtn.textContent = "Loading...";
  statusEl.textContent = "Fetching weather data...";
  statusEl.classList.remove("error");
  resultsEl.classList.remove("show");

try {
    const response = await fetch(API_URL); // Make the API request //

    if(!response.ok){ // Check if the request was seccesful //
        throw new Error('HTTP error! Status: ${response.status}');
    }

    const data = await response.json(); // Parse teh JSON response //

    const current = data.current; // Pull out the current weather values //

    // Display results // 
    tempEl.textContent = `${Math.round(current.temperature_2m)}°F`;
    feelsEl.textContent = `${Math.round(current.apparent_temperature)}°F`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windEl.textContent = `${Math.round(current.wind_speed_10m)} mph`;
    conditionEl.textContent = getWeatherDescription(current.weather_code);

    // Show results and update status
    resultsEl.classList.add("show");
    statusEl.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    // Handle errors
    console.error("API Error:", error);
    statusEl.textContent = "Failed to load weather. Check your connection.";
    statusEl.classList.add("error");
  } finally {
    // Re-enable button
    loadBtn.disabled = false;
    loadBtn.textContent = "Refresh Weather";
  }
});