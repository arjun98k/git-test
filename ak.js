// JavaScript code for the weather app
const API_KEY = "919e9038a0d0c3095c0374b51325bbc9"; // Replace with your actual API key

document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    fetchWeather(city);
  } else {
    displayError("Please enter a city name.");
  }
});

function fetchWeather(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => displayWeather(data))
    .catch((error) => displayError(error.message));
}

function displayWeather(data) {
  document.getElementById("error-message").textContent = "";
  document.getElementById("city-name").textContent = `Weather in ${data.name}`;
  document.getElementById("temperature").textContent =
    `Temperature: ${data.main.temp}°C`;
  document.getElementById("description").textContent =
    `Condition: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent =
    `Humidity: ${data.main.humidity}%`;
}

function displayError(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("city-name").textContent = "";
  document.getElementById("temperature").textContent = "";
  document.getElementById("description").textContent = "";
  document.getElementById("humidity").textContent = "";
}
