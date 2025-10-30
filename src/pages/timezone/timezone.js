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

document.getElementById("searchBtn").addEventListener("click", getTimeForCountry);

async function getTimeForCountry() {
    const countryName = document.getElementById("countryInput").value.trim();
    if (!countryName) {
        showError("Пожалуйста, введите название страны.");
        return;
    }

    showLoading();

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=zone&zone=auto`
        );

        if (!response.ok) {
            throw new Error(`Ошибка при получении данных: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const currentTime = new Date(data.timestamp * 1000).toLocaleString("ru-RU");
        const zoneName = data.zoneName || "неизвестный часовой пояс";

        document.getElementById("currentTime").textContent = `Текущее время в ${countryName}: ${currentTime}`;

        const timeInfoDiv = document.getElementById("timeInfo");
        timeInfoDiv.innerHTML = `
            <p><strong>Часовой пояс:</strong> ${zoneName}</p>
            <p><strong>Разница с UTC:</strong> ${data.gmtOffset / 3600} часов</p>
            <p><strong>Сокращение:</strong> ${data.abbreviation}</p>
        `;
        timeInfoDiv.style.display = "block";
    } catch (error) {
        console.error("Ошибка:", error);
        showError(error.message);
    } finally {
        hideLoading();
    }
}