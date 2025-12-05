import { useState } from 'react'
import { Link } from 'react-router-dom'
import './TimezonePage.css'

const API_KEY = "AZOXK4TOE2EK"

interface GeoData {
  lat: string
  lon: string
}

interface TimezoneData {
  timestamp: number
  zoneName: string
  gmtOffset: number
  abbreviation: string
  countryName: string
}

export default function TimezonePage() {
  const [cityInput, setCityInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [timeInfo, setTimeInfo] = useState<{
    zoneName: string
    gmtOffset: number
    abbreviation: string
  } | null>(null)
  const [showError, setShowError] = useState(false)

  const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 15000): Promise<Response> => {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Превышено время ожидания запроса (15 секунд).')), timeout)
      )
    ])
  }

  const getTimeForCity = async () => {
    const cityName = cityInput.trim()
    if (!cityName) {
      setError("Пожалуйста, введите название города.")
      setShowError(true)
      return
    }

    setLoading(true)
    setShowError(false)
    setError('')
    setCurrentTime('')
    setTimeInfo(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const geoResponse = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
      )

      if (!geoResponse.ok) {
        throw new Error(`Ошибка при геокодировании: ${geoResponse.status} ${geoResponse.statusText}`)
      }

      const geoData: GeoData[] = await geoResponse.json()
      if (!geoData || geoData.length === 0) {
        throw new Error("Город не найден.")
      }

      const lat = geoData[0].lat
      const lon = geoData[0].lon

      const tzResponse = await fetchWithTimeout(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`
      )

      if (!tzResponse.ok) {
        throw new Error(`Ошибка при получении данных о часовом поясе: ${tzResponse.status} ${tzResponse.statusText}`)
      }

      const data: TimezoneData = await tzResponse.json()

      if (!data.timestamp) {
        throw new Error("Сервер вернул некорректные данные о часовом поясе.")
      }

      const userTime = new Date(data.timestamp * 1000)
      const userTimeString = userTime.toLocaleString("ru-RU")

      let countryName = data.countryName || "неизвестная страна"
      countryName = countryName.replace(/\s*\([^)]+\)/g, '').trim()

      setCurrentTime(`Текущее время в ${cityName} (${countryName}): ${userTimeString}`)
      setTimeInfo({
        zoneName: data.zoneName || "неизвестный",
        gmtOffset: data.gmtOffset,
        abbreviation: data.abbreviation || "неизвестно"
      })
    } catch (err) {
      console.error("Ошибка:", err)
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      if (errorMessage.includes("таймаут")) {
        setError(errorMessage)
      } else if (errorMessage.includes("некорректные данные")) {
        setError("Сервер вернул некорректные данные о часовом поясе.")
      } else {
        setError(errorMessage)
      }
      setShowError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getTimeForCity()
    }
  }

  return (
    <div className="timezone-page">
      <Link to="/" className="back-btn">← Назад</Link>
      
      <header>
        <h1>Время в разных городах мира</h1>
        <p>Введите название города, чтобы узнать текущее время</p>
      </header>
      <main>
        <div className="search-container">
          <input
            type="text"
            id="cityInput"
            placeholder="Введите название города"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="searchBtn" onClick={getTimeForCity} disabled={loading}>
            {loading ? 'Загрузка...' : 'Показать время'}
          </button>
        </div>
        {loading && (
          <div className="loading-indicator">
            <p>Загрузка...</p>
          </div>
        )}
        {currentTime && <div id="currentTime">{currentTime}</div>}
        {timeInfo && (
          <div id="timeInfo">
            <p><strong>Часовой пояс:</strong> {timeInfo.zoneName}</p>
            <p><strong>Разница с UTC:</strong> {timeInfo.gmtOffset / 3600} часов</p>
            <p><strong>Сокращение:</strong> {timeInfo.abbreviation}</p>
          </div>
        )}
        {showError && (
          <div id="errorContainer" className="error-container">
            <div className="error-message">
              <span id="errorMessageText">{error}</span>
              <button id="closeErrorBtn" className="close-error-btn" onClick={() => setShowError(false)}>
                &times;
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

