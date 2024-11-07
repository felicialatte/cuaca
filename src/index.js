function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let feelsLikeElement = document.querySelector("#feels-like");
  let feelsLike = response.data.temperature.feels_like;
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let timeElement = document.querySelector("#time");
  let dayAndDateElement = document.querySelector("#day-and-date");
  let date = new Date(response.data.time * 1000);
  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = response.data.city;
  countryElement.innerHTML = response.data.country;
  timeElement.innerHTML = updateTime(date);
  dayAndDateElement.innerHTML = formatDate(date);
  feelsLikeElement.innerHTML = Math.round(feelsLike);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed} km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-emoji" />`;

  getForecast(response.data.city);
}

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let currentDate = date.getDate();

  return `${day}, ${currentDate} ${month}`;
}

function updateTime() {
  let now = new Date();
  let timeString = now.toLocaleTimeString();
  document.getElementById("time").innerText = timeString;

  let hours = now.getHours();
  let minutes = now.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "ta46b3ee4a3be70c0d2a54a8608fodbb";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(refreshWeather);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");

  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "ta46b3ee4a3be70c0d2a54a8608fodbb";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(day.time)}</div>

        <img src="${day.condition.icon_url}" class="weather-forecast-icon"/>
         <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>
            ${Math.round(day.temperature.maximum)}°</strong>
          </div>
          <div class="weather-forecast-temperature">
            ${Math.round(day.temperature.minimum)}°</div>
        </div>
      </div>
  `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Los Angeles");
setInterval(updateTime, 1000);
updateTime();
