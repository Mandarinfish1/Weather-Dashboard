//API Key to access weather data from openweathermap.org
const API_KEY = '09d7eef7116fab393a87b86755626c97';

//HTML elements from the HTML file to be used as variables in script.js file
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

//Using an event listener for the search form to listen for a submit event.
//If a city is submitted, then the fetchWeather(city) function is executed.
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const city = searchInput.value;
    if (city) {
        fetchWeather(city);
    }
});

//Fetching weather data for a submitted city.
//Using async/await to wait for fetch request to complete before continuing. 
async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`); 
    const data = await response.json();
    if (data.cod === 200) {
      //if API request successful (code 200) then executes displayCurrentWeather function.
      let savedCities = JSON.parse(localStorage.getItem("savedCities")) || []
      if (!savedCities.includes(city)) {
        savedCities.push(city)
      }
      localStorage.setItem("savedCities", JSON.stringify(savedCities)) // Save the array of cities to localStorage
      displaySavedCities() // Update the list of saved cities on the webpage

      displayCurrentWeather(data)
      fetchForecast(city)
    } else {
        alert('City not found. Please try again.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const lastSearchedCity = localStorage.getItem("lastSearchedCity")
  if (lastSearchedCity) {
    fetchWeather(lastSearchedCity);
  }
});



//Using template literals to update values for current weather temp, humidity, wind speed for city submitted.
function displayCurrentWeather(data) {
    const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const html = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <img src="${weatherIconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        <p>Temperature: ${data.main.temp}°F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeather.innerHTML = html;
    //Unhiding the currentWeather to make it visible.
   // currentWeather.classList.remove('hidden');
}
//Fetch the 5-day forecast data for the submitted city.
async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`);
    const data = await response.json();
    displayForecast(data.list);
}
//Display the 5-day forecast data for the submitted city using template literals.
function displayForecast(forecastData) {
    const dailyData = forecastData.filter((item, index) => index % 8 === 0);
    let html = '';
    dailyData.forEach(data => {
        const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        html += `
            <div>
                <h3>${new Date(data.dt_txt).toLocaleDateString()}</h3>
                <img src="${weatherIconUrl}" alt="${data.weather[0].description}" class="weather-icon">
                <p>Temperature: ${data.main.temp}°F</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
        `;
    });
    forecast.innerHTML = html;
    //Unhiding the forecast heading once the forecast data has been fetched and displayed.
    //document.getElementById('forecast-heading').classList.remove('hidden');
    }

    function displaySavedCities() {
      const savedCities = JSON.parse(localStorage.getItem("savedCities")) || []
      const savedCitiesContainer = document.getElementById("saved-cities")

      let html = ""
      savedCities.forEach((city) => {
        html += `<li>${city}</li>`
      })

      savedCitiesContainer.innerHTML = html
    }
    document.addEventListener("DOMContentLoaded", () => {
      displaySavedCities()
    });





