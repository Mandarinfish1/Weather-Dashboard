const API_KEY = '09d7eef7116fab393a87b86755626c97';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const city = searchInput.value;
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    if (data.cod === 200) {
        displayCurrentWeather(data);
        fetchForecast(city);
    } else {
        alert('City not found. Please try again.');
    }
}

function displayCurrentWeather(data) {
    const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const html = `
        <h2>${data.name} (${new Date().toLocaleDateString()})</h2>
        <img src="${weatherIconUrl}" alt="${data.weather[0].description}" class="weather-icon">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
    currentWeather.innerHTML = html;
}

async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    displayForecast(data.list);
}

function displayForecast(forecastData) {
    const dailyData = forecastData.filter((item, index) => index % 8 === 0);
    let html = '';
    dailyData.forEach(data => {
        const weatherIconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        html += `
            <div>
                <h3>${new Date(data.dt_txt).toLocaleDateString()}</h3>
                <img src="${weatherIconUrl}" alt="${data.weather[0].description}" class="weather-icon">
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Wind Speed: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
        `;
    });
    forecast.innerHTML = html;
}
