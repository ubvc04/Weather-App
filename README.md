# 🌦️ Weather Web Application

A modern, responsive, and visually engaging real-time weather web app built with HTML, CSS, and JavaScript. Fetches live weather data from OpenWeatherMap based on user geolocation or city search.

---

## 🚀 Features

- **Real-time weather** for your current location (Geolocation API)
- **City search**: Enter any city to get its weather
- **Display:**
  - Current temperature (°C/°F toggle)
  - Weather description (e.g. "clear sky", "light rain")
  - Wind speed
  - Humidity
  - Sunrise and sunset time
  - Feels like temperature
  - Cloud coverage
  - Pressure
- **5-day forecast**
- **Animated backgrounds/icons** based on weather
- **Responsive design** (mobile & desktop)
- **Loading spinner** and error handling
- **Weather-based theming** (e.g. night mode)

---

## 🛠️ Setup & Usage

1. **Clone or Download** this repository.
2. **Get an OpenWeatherMap API Key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/)
   - Go to your API keys and copy one
3. **Add your API key:**
   - Open `app.js`
   - Replace the value of `API_KEY` with your key:
     ```js
     const API_KEY = 'YOUR_API_KEY_HERE';
     ```
4. **Run the app locally:**
   - **Do NOT open `index.html` directly!**
   - Use a local server:
     - **VSCode:** Install the Live Server extension, right-click `index.html` → "Open with Live Server"
     - **Python:**
       - Python 3: `python -m http.server 8000`
       - Python 2: `python -m SimpleHTTPServer 8000`
     - **Node.js:** `npm install -g http-server` then `http-server`
   - Open your browser to the shown local address (e.g., `http://localhost:8000`)

---

## 🌍 Deployment

- You can deploy this app to GitHub Pages or any static hosting service.
- No backend required.
- For GitHub Pages:
  1. Push your code to a GitHub repository
  2. Go to repository settings → Pages → Set source to `main` branch and `/root` folder
  3. Visit your published site!

---

## 🖼️ Screenshots

> _Add screenshots here if you like!_

---

## ⚠️ Notes

- This app is for educational/demo purposes. Do not expose your API key in production.
- Free OpenWeatherMap API keys have request limits.
- Some features (like geolocation) may require HTTPS in production.

---

## 📄 License

MIT 