import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

interface Capital {
  name: string
  tags: string
}

const capitals: Capital[] = [
  { name: "Москва",         tags: "Moscow,city,street,Russia" },
  { name: "Париж",          tags: "Paris,city,street,France" },
  { name: "Лондон",         tags: "London,city,street,England" },
  { name: "Берлин",         tags: "Berlin,city,street,Germany" },
  { name: "Рим",            tags: "Rome,city,street,Italy" },
  { name: "Мадрид",         tags: "Madrid,city,street,Spain" },
  { name: "Амстердам",      tags: "Amsterdam,city,street,canal,Netherlands" },
  { name: "Вена",           tags: "Vienna,city,street,Austria" },
  { name: "Прага",          tags: "Prague,city,street,Czech Republic" },
  { name: "Афины",          tags: "Athens,city,street,Greece" },
  { name: "Будапешт",       tags: "Budapest,city,street,Hungary" },
  { name: "Копенгаген",     tags: "Copenhagen,city,street,Denmark" },
  { name: "Стокгольм",      tags: "Stockholm,city,street,Sweden" },
  { name: "Хельсинки",      tags: "Helsinki,city,street,Finland" },
  { name: "Варшава",        tags: "Warsaw,city,street,Poland" },
  { name: "Брюссель",       tags: "Brussels,city,street,Belgium" },
  { name: "Вашингтон",      tags: "Washington DC,city,street,USA" },
  { name: "Мехико",         tags: "Mexico City,city,street,Mexico" },
  { name: "Буэнос-Айрес",   tags: "Buenos Aires,city,street,Argentina" },
  { name: "Бразилиа",       tags: "Brasilia,city,street,Brazil" },
  { name: "Токио",          tags: "Tokyo,city,street,Japan" },
  { name: "Пекин",          tags: "Beijing,city,street,China" },
  { name: "Сеул",           tags: "Seoul,city,street,South Korea" },
  { name: "Бангкок",        tags: "Bangkok,city,street,Thailand" },
  { name: "Дели",           tags: "New Delhi,city,street,India" },
  { name: "Сингапур",       tags: "Singapore,city,street" },
  { name: "Куала-Лумпур",   tags: "Kuala Lumpur,city,street,Malaysia" },
  { name: "Джакарта",       tags: "Jakarta,city,street,Indonesia" },
  { name: "Каир",           tags: "Cairo,city,street,Egypt" },
  { name: "Сидней",         tags: "Sydney,city,street,Australia" }
]

function pickRandom<T>(arr: T[]): T {
  const idx = Math.floor(Math.random() * arr.length)
  return arr[idx]
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

async function fetchImageBlobUrl(tags: string): Promise<string> {
  const proxy = "https://corsproxy.io/?"
  const url =
    "https://loremflickr.com/400/300/" +
    encodeURIComponent(tags) +
    "?lock=" + Math.floor(Math.random() * 1000000)

  const response = await fetch(proxy + url)
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export default function HomePage() {
  const [score, setScore] = useState(0)
  const [correctCapital, setCorrectCapital] = useState<Capital | null>(null)
  const [options, setOptions] = useState<string[]>([])
  const [questionLocked, setQuestionLocked] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [resultColor, setResultColor] = useState('#1c355e')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const loadImages = async (tags: string) => {
    const urls = await Promise.all([
      fetchImageBlobUrl(tags),
      fetchImageBlobUrl(tags),
      fetchImageBlobUrl(tags),
      fetchImageBlobUrl(tags)
    ])
    setImageUrls(urls)
  }

  const newQuestion = async () => {
    setQuestionLocked(false)
    setResult('')
    setResultColor('#1c355e')
    setSelectedAnswer(null)

    const capital = pickRandom(capitals)
    setCorrectCapital(capital)

    const others = capitals.filter(c => c.name !== capital.name)
    const randomThree = shuffle(others).slice(0, 3).map(c => c.name)
    const shuffledOptions = shuffle([capital.name, ...randomThree])
    setOptions(shuffledOptions)

    await loadImages(capital.tags)
  }

  const checkAnswer = (chosen: string) => {
    if (questionLocked || !correctCapital) return

    setQuestionLocked(true)
    setSelectedAnswer(chosen)

    if (chosen === correctCapital.name) {
      setResult(`Правильно! Это ${correctCapital.name}`)
      setResultColor('green')
      setScore(prev => prev + 1)
    } else {
      setResult(`Неверно. Это была: ${correctCapital.name}`)
      setResultColor('red')
    }
  }

  useEffect(() => {
    newQuestion()
  }, [])

  return (
    <div className="home-page">
      <header>
        <h1>Угадайте столицу по фото</h1>
        <h3>Новые фото подгружаются в теч. 2-6 сек</h3>
        <p>Ваш счёт: <span>{score}</span></p>

        <nav>
          <ul>
            <li><Link to="/weather">Узнать погоду</Link></li>
            <li><Link to="/currency">Узнать курс</Link></li>
            <li><Link to="/timezone">Узнать время</Link></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="gallery">
          {imageUrls.map((url, i) => (
            <img key={i} className="city-photo" src={url} alt="Фото города" />
          ))}
        </section>

        <section className="answers">
          {options.map((name) => {
            let buttonClass = 'answer-button'
            if (selectedAnswer === name) {
              buttonClass += name === correctCapital?.name ? ' correct' : ' incorrect'
            } else if (selectedAnswer && name === correctCapital?.name) {
              buttonClass += ' correct'
            }
            return (
              <button
                key={name}
                className={buttonClass}
                onClick={() => checkAnswer(name)}
                disabled={questionLocked}
              >
                {name}
              </button>
            )
          })}
        </section>

        <p className="result" style={{ color: resultColor }}>{result}</p>

        <button className="next-button" onClick={newQuestion}>
          Следующий город
        </button>
      </main>

      <footer>
        <p>2052 все права не защищены</p>
      </footer>
    </div>
  )
}

