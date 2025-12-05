import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WeatherPage from './pages/WeatherPage'
import CurrencyPage from './pages/CurrencyPage'
import TimezonePage from './pages/TimezonePage'

function App() {
  return (
    <BrowserRouter basename="/OpenWorld-Widgets">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/currency" element={<CurrencyPage />} />
        <Route path="/timezone" element={<TimezonePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

