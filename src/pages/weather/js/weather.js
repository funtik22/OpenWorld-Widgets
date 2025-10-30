class WeatherWidget {
    constructor() {
        this.baseURL = 'https://goweather.xyz/weather/';
        this.init();
    }

    init() {
        this.cityInput = document.getElementById('cityInput');
        this.getWeatherBtn = document.getElementById('getWeatherBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.weatherResult = document.getElementById('weatherResult');
        this.cityName = document.getElementById('cityName');
        this.currentTemp = document.getElementById('currentTemp');
        this.weatherDesc = document.getElementById('weatherDesc');
        this.windSpeed = document.getElementById('windSpeed');
        this.forecastCards = document.getElementById('forecastCards');

        this.getWeatherBtn.addEventListener('click', () => this.getWeather());
        
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getWeather();
            }
        });

        
        this.checkUrlParams();
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const city = urlParams.get('city');
        
        if (city) {
            this.cityInput.value = city;
            this.getWeather();
        }
    }

    async getWeather() {
        const city = this.cityInput.value.trim();
        
        if (!city) {
            this.showError('Пожалуйста, введите название города');
            return;
        }

        this.setLoading(true);
        this.hideError();
        this.hideWeatherResult();

        try {
            const response = await fetch(`${this.baseURL}${encodeURIComponent(city)}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
            }

            const weatherData = await response.json();
            
            
            if (!weatherData.temperature || weatherData.temperature === "") {
                throw new Error('Город не найден или данные недоступны');
            }

            this.displayWeather(city, weatherData);
            
            
            this.updateUrl(city);

        } catch (error) {
            console.error('Ошибка при получении погоды:', error);
            this.showError(`Не удалось получить данные для города "${city}". Проверьте название города и попробуйте снова.`);
        } finally {
            this.setLoading(false);
        }
    }

    displayWeather(city, data) {
        
        this.cityName.textContent = city;
        this.currentTemp.textContent = data.temperature;
        this.weatherDesc.textContent = data.description;
        this.windSpeed.textContent = data.wind;

        
        this.updateForecast(data.forecast);

        
        this.weatherResult.classList.remove('hidden');
    }

    updateForecast(forecast) {
        this.forecastCards.innerHTML = '';

        forecast.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'forecast-card';
            
            let dayText = '';
            switch (day.day) {
                case '1':
                    dayText = 'Завтра';
                    break;
                case '2':
                    dayText = 'Послезавтра';
                    break;
                case '3':
                    dayText = 'Через 3 дня';
                    break;
                default:
                    dayText = `День ${day.day}`;
            }

            forecastCard.innerHTML = `
                <div class="forecast-day">${dayText}</div>
                <div class="forecast-temp">${day.temperature}</div>
                <div class="forecast-wind">💨 ${day.wind}</div>
            `;
            
            this.forecastCards.appendChild(forecastCard);
        });
    }

    updateUrl(city) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('city', city);
        window.history.replaceState({}, '', newUrl);
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.remove('hidden');
            this.getWeatherBtn.disabled = true;
            this.getWeatherBtn.textContent = 'Загрузка...';
        } else {
            this.loading.classList.add('hidden');
            this.getWeatherBtn.disabled = false;
            this.getWeatherBtn.textContent = 'Получить погоду';
        }
    }

    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
    }

    hideError() {
        this.error.classList.add('hidden');
    }

    hideWeatherResult() {
        this.weatherResult.classList.add('hidden');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
});


console.log('Погодный виджет инициализирован. Готов к работе!');