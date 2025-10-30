const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const result = document.getElementById('result');

function showLoading() {
    loading.classList.add('show');
    error.classList.remove('show');
    result.classList.remove('show');
    searchBtn.disabled = true;
}

function hideLoading() {
    loading.classList.remove('show');
    searchBtn.disabled = false;
}

function showError(message) {
    error.textContent = message;
    error.classList.add('show');
    result.classList.remove('show');
}

function showResult(data) {
    document.getElementById('flag').textContent = data.flag;
    document.getElementById('cityName').textContent = data.city;
    document.getElementById('countryName').textContent = data.country;
    document.getElementById('currencyCode').textContent = data.currencyCode;
    document.getElementById('rateValue').textContent = `${data.rate} ₽`;
    
    result.classList.add('show');
    error.classList.remove('show');
}

async function getCityInfo(cityName) {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1&accept-language=en`;
    
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'CurrencyConverterApp/1.0'
        }
    });
    
    if (!response.ok) {
        throw new Error('Не удалось найти город');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
        throw new Error('Город не найден');
    }
    
    return data[0];
}

async function getCountryInfoByName(countryName) {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Не удалось получить информацию о стране по названию');
    }
    
    const data = await response.json();
    return data[0];
}

async function getExchangeRate(currencyCode) {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyCode}.json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Не удалось получить курс валюты');
    }
    
    const data = await response.json();
    
    if (!data[currencyCode] || !data[currencyCode].rub) {
        throw new Error('Курс для этой валюты недоступен');
    }
    
    return data[currencyCode].rub;
}

async function searchCurrency() {
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        showError('Пожалуйста, введите название города');
        return;
    }

    showLoading();

    try {
        const cityData = await getCityInfo(cityName);
        
        
        const displayNameParts = cityData.display_name.split(', ');
        const countryName = displayNameParts[displayNameParts.length - 1];
        const cityNameDisplay = cityData.name || displayNameParts[0];
        
        
        const countryInfo = await getCountryInfoByName(countryName);

        if (!countryInfo.currencies) {
            throw new Error('Не удалось определить валюту для этой страны');
        }
        
        const currencyCode = Object.keys(countryInfo.currencies)[0].toLowerCase();
        const currencyName = Object.keys(countryInfo.currencies)[0];
        
        console.log('Код валюты:', currencyCode);

        if (currencyCode === 'rub') {
            showError('Этот город находится в России. Курс рубля к рублю = 1 ₽');
            hideLoading();
            return;
        }

        const rate = await getExchangeRate(currencyCode);

        showResult({
            city: cityNameDisplay,
            country: countryInfo.name.common,
            currencyCode: currencyName,
            rate: rate.toFixed(2),
            flag: countryInfo.flag
        });

    } catch (err) {
        console.error('Ошибка:', err);
        showError(err.message || 'Произошла ошибка при получении данных');
    } finally {
        hideLoading();
    }
}

searchBtn.addEventListener('click', searchCurrency);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCurrency();
    }
});