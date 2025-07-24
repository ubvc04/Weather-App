// ====== CONFIG ======
const API_KEY = '1e4f0a547c8124e170bc1682d94d5b44'; // <-- User's real key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

// ====== DOM ELEMENTS ======
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const geoBtn = document.getElementById('geo-btn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const weatherCard = document.getElementById('weather-card');
const forecastSection = document.getElementById('forecast');
const unitToggleC = document.getElementById('celsius');
const unitToggleF = document.getElementById('fahrenheit');

// Weather info elements
const cityName = document.getElementById('city-name');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feels-like');
const wind = document.getElementById('wind');
const humidity = document.getElementById('humidity');
const clouds = document.getElementById('clouds');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherIcon = document.getElementById('weather-icon');

// ====== STATE ======
let currentUnit = 'metric'; // 'metric' for °C, 'imperial' for °F
let lastCoords = null;
let lastCity = null;

// ====== HELPERS ======
function showLoading(show) {
  loadingDiv.classList.toggle('hidden', !show);
}
function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.classList.remove('hidden');
}
function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}
function setWeatherBackground(main, isNight) {
  document.body.className = '';
  if (isNight) document.body.classList.add('night');
  else if (/clear/i.test(main)) document.body.classList.add('sunny');
  else if (/rain/i.test(main)) document.body.classList.add('rainy');
  else if (/thunderstorm/i.test(main)) document.body.classList.add('thunderstorm');
  else if (/snow/i.test(main)) document.body.classList.add('snow');
  else if (/mist|fog|haze/i.test(main)) document.body.classList.add('mist');
}
function formatTime(unix, tzOffset) {
  const date = new Date((unix + tzOffset) * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ====== API CALLS ======
async function fetchWeatherByCoords(lat, lon) {
  showLoading(true);
  clearError();
  try {
    const res = await fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`);
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();
    updateWeatherUI(data);
    lastCoords = { lat, lon };
    lastCity = null;
    fetchForecast(lat, lon, data.timezone);
  } catch (e) {
    showError(e.message);
    weatherCard.classList.add('hidden');
    forecastSection.classList.add('hidden');
  } finally {
    showLoading(false);
  }
}
async function fetchWeatherByCity(city) {
  showLoading(true);
  clearError();
  try {
    const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${currentUnit}`;
    console.log('Fetching:', url);
    const res = await fetch(url);
    console.log('Response status:', res.status);
    if (!res.ok) {
      const errorBody = await res.text();
      console.error('API error body:', errorBody);
      throw new Error('City not found');
    }
    const data = await res.json();
    updateWeatherUI(data);
    lastCoords = { lat: data.coord.lat, lon: data.coord.lon };
    lastCity = city;
    fetchForecast(data.coord.lat, data.coord.lon, data.timezone);
  } catch (e) {
    showError(e.message);
    weatherCard.classList.add('hidden');
    forecastSection.classList.add('hidden');
  } finally {
    showLoading(false);
  }
}
async function fetchForecast(lat, lon, tzOffset) {
  forecastSection.innerHTML = '';
  try {
    const res = await fetch(`${BASE_URL}forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${currentUnit}`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    const data = await res.json();
    renderForecast(data, tzOffset);
  } catch (e) {
    forecastSection.innerHTML = '<div class="error">Forecast unavailable.</div>';
  }
}

// ====== UI UPDATE ======
function updateWeatherUI(data) {
  weatherCard.classList.remove('hidden');
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  description.textContent = data.weather[0].description;
  temperature.textContent = `${Math.round(data.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}`;
  feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°`;
  wind.textContent = `${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`;
  humidity.textContent = `${data.main.humidity}%`;
  clouds.textContent = `${data.clouds.all}%`;
  pressure.textContent = `${data.main.pressure} hPa`;
  sunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
  sunset.textContent = formatTime(data.sys.sunset, data.timezone);
  setWeatherBackground(data.weather[0].main, isNight(data));
  setWeatherIcon(data.weather[0].icon, data.weather[0].main);
}
function renderForecast(data, tzOffset) {
  if (!data.list || !data.list.length) return;
  // Show 5-day forecast (one per day at 12:00)
  let days = {};
  data.list.forEach(item => {
    const date = new Date((item.dt + data.city.timezone) * 1000);
    const day = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    if (!days[day] && date.getHours() === 12) days[day] = item;
  });
  forecastSection.classList.remove('hidden');
  forecastSection.innerHTML = '<h3>5-Day Forecast</h3><div class="forecast-row">' +
    Object.values(days).map(item => `
      <div class="forecast-card">
        <div class="forecast-date">${new Date((item.dt + data.city.timezone) * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</div>
        <div class="forecast-icon">${getWeatherIconSVG(item.weather[0].icon, item.weather[0].main)}</div>
        <div class="forecast-temp">${Math.round(item.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
        <div class="forecast-desc">${item.weather[0].main}</div>
      </div>
    `).join('') + '</div>';
}
function setWeatherIcon(icon, main) {
  weatherIcon.innerHTML = getWeatherIconSVG(icon, main);
}
function getWeatherIconSVG(icon, main) {
  // Placeholder: Use OpenWeatherMap icon or custom SVGs/animations
  // You can replace this with animated SVGs for advanced UI
  return `<img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${main}" style="width:64px;height:64px;">`;
}
function isNight(data) {
  const now = Math.floor(Date.now() / 1000);
  return now < data.sys.sunrise || now > data.sys.sunset;
}

// ====== EVENTS ======
searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
});
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation not supported.');
    return;
  }
  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    pos => {
      fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
    },
    err => {
      showError('Geolocation denied.');
      showLoading(false);
    }
  );
});
unitToggleC.addEventListener('click', () => {
  if (currentUnit !== 'metric') {
    currentUnit = 'metric';
    unitToggleC.classList.add('active');
    unitToggleF.classList.remove('active');
    reloadWeather();
  }
});
unitToggleF.addEventListener('click', () => {
  if (currentUnit !== 'imperial') {
    currentUnit = 'imperial';
    unitToggleF.classList.add('active');
    unitToggleC.classList.remove('active');
    reloadWeather();
  }
});
function reloadWeather() {
  if (lastCoords) fetchWeatherByCoords(lastCoords.lat, lastCoords.lon);
  else if (lastCity) fetchWeatherByCity(lastCity);
}

// ====== INIT ======
window.addEventListener('DOMContentLoaded', () => {
  // Try geolocation on load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => showError('Allow location or search for a city.')
    );
  } else {
    showError('Geolocation not supported.');
  }
});
