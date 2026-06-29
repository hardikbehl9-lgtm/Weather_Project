
const apiKey = '169f13dd84d00aa9ed0aaddb06d3a579'; 



const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const cityInput = document.getElementById('cityInput');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');
const particles = document.getElementById('particles');

// --- Theme Toggling ---
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

// --- Fetch by City Name ---
async function checkWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    fetchData(apiUrl);
}

// --- Fetch by Geolocation ---
geoBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
                fetchData(geoUrl);
            },
            () => {
                alert("Location access denied or unavailable.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

// --- Core Fetch Logic ---
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Location not found');
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError();
    }
}

// --- Display Data & Updates ---
function displayWeather(data) {
    errorMessage.classList.add('hidden');
    weatherCard.classList.remove('hidden');

    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    // Standard Metrics
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${temp}°C`;
    document.getElementById('weatherDesc').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    // Visibility (Convert meters to km)
    const visKm = (data.visibility / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visKm} km`;

    // Sunrise & Sunset (Convert UNIX timestamp to local time string)
    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('sunrise').textContent = sunriseTime;
    document.getElementById('sunset').textContent = sunsetTime;

    // Icon
    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    // Trigger AI Insight & Particles
    generateInsight(temp, condition);
    generateParticles(condition);
}

// --- AI Weather Insights Logic ---
function generateInsight(temp, condition) {
    const insightEl = document.getElementById('aiInsight');
    let msg = "";

    if (condition === "Clear") {
        msg = temp > 25 ? "☀️ High UV likely. Perfect day for the beach, but wear sunscreen!" : "☀️ Crisp and clear. Great day for a walk or outdoor activities.";
    } else if (condition === "Rain" || condition === "Drizzle") {
        msg = "🌧️ It's wet out there! Grab an umbrella and maybe enjoy a good book indoors.";
    } else if (condition === "Snow") {
        msg = "❄️ Freezing conditions. Drive safely and bundle up!";
    } else if (condition === "Clouds") {
        msg = "☁️ Overcast skies today. Good weather for focused work or a comfortable run.";
    } else {
        msg = "✨ Conditions are shifting. Stay prepared for anything.";
    }

    insightEl.textContent = `💡 Insight: ${msg}`;
}

// --- Particle Animation (CSS Integration) ---
function generateParticles(condition) {
    particles.innerHTML = ''; // Clear previous particles
    if (condition === 'Rain' || condition === 'Drizzle') {
        for (let i = 0; i < 50; i++) {
            let drop = document.createElement('div');
            drop.classList.add('drop');
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            particles.appendChild(drop);
        }
    }
    // You can expand this for Snow particles as well!
}

function showError() {
    weatherCard.classList.add('hidden');
    errorMessage.classList.remove('hidden');
}

// --- Event Listeners ---
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") checkWeather(cityInput.value);
});

cityInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && cityInput.value.trim() !== "") checkWeather(cityInput.value);
});