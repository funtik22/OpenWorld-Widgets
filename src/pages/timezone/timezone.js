const API_KEY = "AZOXK4TOE2EK";

const errorContainer = document.getElementById("errorContainer");
const errorMessageText = document.getElementById("errorMessageText");
const closeErrorBtn = document.getElementById("closeErrorBtn");
const loadingIndicator = document.getElementById("loadingIndicator");
const searchBtn = document.getElementById("searchBtn");

closeErrorBtn.addEventListener("click", () => {
    errorContainer.style.display = "none";
});

function showError(message) {
    errorMessageText.textContent = message;
    errorContainer.style.display = "block";
}

function showLoading() {
    loadingIndicator.style.display = "block";
    searchBtn.disabled = true;
    searchBtn.textContent = "Загрузка...";
}

function hideLoading() {
    loadingIndicator.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.textContent = "Показать время";
}

function fetchWithTimeout(url, options = {}, timeout = 15000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Превышено время ожидания запроса (15 секунд).')), timeout)
        )
    ]);
}

document.getElementById("searchBtn").addEventListener("click", getTimeForCity);

async function getTimeForCity() {
    const cityName = document.getElementById("cityInput").value.trim();
    if (!cityName) {
        showError("Пожалуйста, введите название города.");
        return;
    }

    showLoading();

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const geoResponse = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
        );

        if (!geoResponse.ok) {
            throw new Error(`Ошибка при геокодировании: ${geoResponse.status} ${geoResponse.statusText}`);
        }

        const geoData = await geoResponse.json();
        if (!geoData || geoData.length === 0) {
            throw new Error("Город не найден.");
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const tzResponse = await fetchWithTimeout(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
        );

        if (!tzResponse.ok) {
            throw new Error(`Ошибка при получении данных о часовом поясе: ${tzResponse.status} ${tzResponse.statusText}`);
        }

        const data = await tzResponse.json();

        if (!data.timestamp) {
            throw new Error("Сервер вернул некорректные данные о часовом поясе.");
        }

        const userTime = new Date(data.timestamp * 1000);
        const userTimeString = userTime.toLocaleString("ru-RU");

        let countryName = data.countryName || "неизвестная страна";
        countryName = countryName.replace(/\s*\([^)]+\)/g, '').trim();

        document.getElementById("currentTime").textContent = `Текущее время в ${cityName} (${countryName}): ${userTimeString}`;

        const timeInfoDiv = document.getElementById("timeInfo");
        timeInfoDiv.innerHTML = `
            <p><strong>Часовой пояс:</strong> ${data.zoneName || "неизвестный"}</p>
            <p><strong>Разница с UTC:</strong> ${data.gmtOffset / 3600} часов</p>
            <p><strong>Сокращение:</strong> ${data.abbreviation || "неизвестно"}</p>
        `;
        timeInfoDiv.style.display = "block";
    } catch (error) {
        console.error("Ошибка:", error);
        if (error.message.includes("таймаут")) {
            showError(error.message);
        } else if (error.message.includes("некорректные данные")) {
            showError("Сервер вернул некорректные данные о часовом поясе.");
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}