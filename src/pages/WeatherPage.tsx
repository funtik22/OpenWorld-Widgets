import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './WeatherPage.css'

interface ForecastDay {
  day: string
  temperature: string
  wind: string
}

interface WeatherData {
  temperature: string
  description: string
  wind: string
  forecast: ForecastDay[]
}

export default function WeatherPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

  const baseURL = 'https://goweather.xyz/weather/'

  const getWeather = async () => {
    const cityName = city.trim()
    
    if (!cityName) {
      setError('Пожалуйста, введите название города')
      return
    }

    setLoading(true)
    setError('')
    setWeatherData(null)

    try {
      const response = await fetch(`${baseURL}${encodeURIComponent(cityName)}`)
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP! Статус: ${response.status}`)
      }

      const data: WeatherData = await response.json()
      
      if (!data.temperature || data.temperature === "") {
        throw new Error('Город не найден или данные недоступны')
      }

      setWeatherData(data)
      setSearchParams({ city: cityName })
    } catch (err) {
      setError(`Не удалось получить данные для города "${cityName}". Проверьте название города и попробуйте снова.`)
      console.error('Ошибка при получении погоды:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cityParam = searchParams.get('city')
    if (cityParam) {
      setCity(cityParam)
      // Don't auto-fetch, let user click button
    }
  }, [searchParams])

  const getDayText = (day: string): string => {
    switch (day) {
      case '1':
        return 'Завтра'
      case '2':
        return 'Послезавтра'
      case '3':
        return 'Через 3 дня'
      default:
        return `День ${day}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getWeather()
    }
  }

  return (
    <div className="weather-page">
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/weather" className="nav-link active">Погода</Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">назад</Link>
            </li>
            <li className="nav-item">
              <Link to="/currency" className="nav-link">курс валют</Link>
            </li>
            <li className="nav-item">
              <Link to="/timezone" className="nav-link">время</Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <header className="header">
          <h1>🌤️ Погодный виджет</h1>
          <p>Узнайте текущую погоду в любом городе</p>
        </header>

        <main className="main-content">
          <div className="input-section">
            <label htmlFor="cityInput" className="input-label">Введите город:</label>
            <div className="input-group">
              <input
                type="text"
                id="cityInput"
                placeholder="Например: Moscow, London, Paris..."
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                id="getWeatherBtn"
                className="submit-btn"
                onClick={getWeather}
                disabled={loading}
              >
                {loading ? 'Загрузка...' : 'Получить погоду'}
              </button>
            </div>
            <p className="url-hint">Или укажите город в URL: ?city=НазваниеГорода</p>
          </div>
          
          <div className="status-section">
            {loading && (
              <div className="loading">
                <div className="spinner"></div>
                <span>Получаем данные о погоде...</span>
              </div>
            )}
            
            {error && <div className="error">{error}</div>}
          </div>

          {weatherData && (
            <div className="weather-result">
              <div className="current-weather">
                <h2 className="city-name">{city}</h2>
                <div className="weather-main">
                  <div className="temperature">{weatherData.temperature}</div>
                  <div className="weather-desc">{weatherData.description}</div>
                </div>
                <div className="weather-details">
                  <div className="detail-item">
                    <span className="detail-label">💨 Ветер:</span>
                    <span className="detail-value">{weatherData.wind}</span>
                  </div>
                </div>
              </div>

              <div className="forecast-section">
                <h3>Прогноз на 3 дня:</h3>
                <div className="forecast-cards">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="forecast-card">
                      <div className="forecast-day">{getDayText(day.day)}</div>
                      <div className="forecast-temp">{day.temperature}</div>
                      <div className="forecast-wind">💨 {day.wind}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>Данные предоставлены API goweather.xyz</p>
        </footer>
      </div>
    </div>
  )
}

