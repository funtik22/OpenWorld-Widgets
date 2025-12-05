import { useState } from 'react'
import { Link } from 'react-router-dom'
import './CurrencyPage.css'

interface CityData {
  name: string
  display_name: string
}

interface CountryInfo {
  name: {
    common: string
  }
  currencies: Record<string, { name: string; symbol: string }>
  flag: string
}

interface CurrencyResult {
  city: string
  country: string
  currencyCode: string
  rate: string
  flag: string
}

export default function CurrencyPage() {
  const [cityInput, setCityInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CurrencyResult | null>(null)

  const showLoading = () => {
    setLoading(true)
    setError('')
    setResult(null)
  }

  const hideLoading = () => {
    setLoading(false)
  }

  const showError = (message: string) => {
    setError(message)
    setResult(null)
  }

  const showResult = (data: CurrencyResult) => {
    setResult(data)
    setError('')
  }

  const getCityInfo = async (cityName: string): Promise<CityData> => {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1&accept-language=en`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CurrencyConverterApp/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error('Не удалось найти город')
    }
    
    const data = await response.json()
    
    if (data.length === 0) {
      throw new Error('Город не найден')
    }
    
    return data[0]
  }

  const getCountryInfoByName = async (countryName: string): Promise<CountryInfo> => {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Не удалось получить информацию о стране по названию')
    }
    
    const data = await response.json()
    return data[0]
  }

  const getExchangeRate = async (currencyCode: string): Promise<number> => {
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyCode}.json`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Не удалось получить курс валюты')
    }
    
    const data = await response.json()
    
    if (!data[currencyCode] || !data[currencyCode].rub) {
      throw new Error('Курс для этой валюты недоступен')
    }
    
    return data[currencyCode].rub
  }

  const searchCurrency = async () => {
    const cityName = cityInput.trim()
    
    if (!cityName) {
      showError('Пожалуйста, введите название города')
      return
    }

    showLoading()

    try {
      const cityData = await getCityInfo(cityName)
      
      const displayNameParts = cityData.display_name.split(', ')
      const countryName = displayNameParts[displayNameParts.length - 1]
      const cityNameDisplay = cityData.name || displayNameParts[0]
      
      const countryInfo = await getCountryInfoByName(countryName)

      if (!countryInfo.currencies) {
        throw new Error('Не удалось определить валюту для этой страны')
      }
      
      const currencyCode = Object.keys(countryInfo.currencies)[0].toLowerCase()
      const currencyName = Object.keys(countryInfo.currencies)[0]
      
      console.log('Код валюты:', currencyCode)

      if (currencyCode === 'rub') {
        showError('Этот город находится в России. Курс рубля к рублю = 1 ₽')
        hideLoading()
        return
      }

      const rate = await getExchangeRate(currencyCode)

      showResult({
        city: cityNameDisplay,
        country: countryInfo.name.common,
        currencyCode: currencyName,
        rate: rate.toFixed(2),
        flag: countryInfo.flag
      })

    } catch (err) {
      console.error('Ошибка:', err)
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при получении данных'
      showError(errorMessage)
    } finally {
      hideLoading()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchCurrency()
    }
  }

  return (
    <div className="currency-page">
      <Link to="/" className="back-btn">← Назад</Link>
      
      <div className="container">
        <h1>Курсы валют</h1>
        <p className="subtitle">Узнайте курс местной валюты к рублю</p>
        
        <div className="input-group">
          <label htmlFor="cityInput">Введите название города:</label>
          <input
            type="text"
            id="cityInput"
            placeholder="Например: Лондон, Париж, Москва..."
            autoComplete="off"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <button id="searchBtn" onClick={searchCurrency} disabled={loading}>
          {loading ? 'Загрузка...' : 'Получить курс'}
        </button>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {result && (
          <div className="result">
            <div className="result-header">
              <span className="flag">{result.flag}</span>
              <div>
                <div className="city-name">{result.city}</div>
                <div className="country-name">{result.country}</div>
              </div>
            </div>
            <div className="rate">
              <div>
                <div className="rate-label">1 <span>{result.currencyCode}</span> =</div>
              </div>
              <div className="rate-value">{result.rate} ₽</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

