const API_KEY = "919e9038a0d0c3095c0374b51325bbc9";

// Event Listeners
document.getElementById("search-btn").addEventListener("click", handleSearch);
document.getElementById("city-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

// Initialize Geolocation
if ("geolocation" in navigator) {
    const geoBtn = document.createElement("button");
    geoBtn.textContent = "Use My Location";
    geoBtn.onclick = getCurrentLocation;
    document.querySelector(".search-container").appendChild(geoBtn);
}

function handleSearch() {
    const city = document.getElementById("city-input").value.trim();
    if (city.length < 2) {
        displayError("Please enter a valid city name");
        return;
    }
    showLoading();
    fetchWeather(city);
 
}

function showLoading() {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("search-btn").disabled = true;
}

function hideLoading() {
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("search-btn").disabled = false;
}

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
            throw new Error(response.status === 404 ? "City not found" : "Failed to fetch weather data");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoading();
    }
}

function getCurrentLocation() {
    showLoading();
    navigator.geolocation.getCurrentPosition(
        position => {
            fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        error => {
            displayError("Unable to get location");
            hideLoading();
        }
    );
}

async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error("Failed to fetch weather data");
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoading();
    }
}

function displayWeather(data) {
    const weatherInfo = document.querySelector(".weather-info");
    weatherInfo.style.display = "block";
    document.getElementById("error-message").textContent = "";
    
    const iconCode = data.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
    document.getElementById("weather-icon").src = iconUrl;
    
    document.getElementById("city-name").textContent = `Weather in ${data.name}`;
    document.getElementById("temperature").textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
    document.getElementById("description").textContent = `Condition: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
}

function displayError(message) {
    const weatherInfo = document.querySelector(".weather-info");
    weatherInfo.style.display = "none";
    document.getElementById("error-message").textContent = message;
}

// Clear input on focus btn
document.getElementById("city-input").addEventListener("focus", function() {
    this.value = "";
});