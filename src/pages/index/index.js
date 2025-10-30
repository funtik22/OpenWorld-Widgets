const capitals = [
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
];

let score = 0;
let correctCapital = null;
let options = [];
let questionLocked = false;

function pickRandom(arr) {
	const idx = Math.floor(Math.random() * arr.length);
	return arr[idx];
}

function shuffle(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ arr[i], arr[j] ] = [ arr[j], arr[i] ];
	}
	return arr;
}

// берём одно изображение из loremflickr с random lock
async function fetchImageBlobUrl(tags) {
	const proxy = "https://corsproxy.io/?";
	const url =
		"https://loremflickr.com/400/300/" +
		encodeURIComponent(tags) +
		"?lock=" + Math.floor(Math.random() * 1000000);

	const response = await fetch(proxy + url);
	const blob = await response.blob();
	return URL.createObjectURL(blob);
}

// загружаем 4 фото параллельно
async function loadImages(tags) {
	const imgEls = document.querySelectorAll(".city-photo");

	const urls = await Promise.all([
		fetchImageBlobUrl(tags),
		fetchImageBlobUrl(tags),
		fetchImageBlobUrl(tags),
		fetchImageBlobUrl(tags)
	]);

	imgEls.forEach((imgEl, i) => {
		imgEl.src = urls[i];
		imgEl.alt = "Фото города";
		imgEl.style.outline = "";
	});
}

// рисуем варианты (кнопки)
function renderAnswers() {
	const answersDiv = document.getElementById("answers");
	answersDiv.innerHTML = "";

	options.forEach(name => {
		const btn = document.createElement("button");
		btn.textContent = name;

		btn.addEventListener("click", () => {
			if (questionLocked) return;
			questionLocked = true;
			checkAnswer(name, btn);
		});

		answersDiv.appendChild(btn);
	});
}

// проверяем клик, красим кнопки, апдейтим счёт
function checkAnswer(chosen, btn) {
	const res = document.getElementById("result");
	const allBtns = Array.from(document.querySelectorAll("#answers button"));

	if (chosen === correctCapital.name) {
		res.textContent = "Правильно! Это " + correctCapital.name;
		res.style.color = "green";

		score += 1;
		document.getElementById("score").textContent = score;

		btn.style.background = "#c8f7c5";
		btn.style.color = "#000";
		btn.style.fontWeight = "bold";
	} else {
		res.textContent = "Неверно. Это была: " + correctCapital.name;
		res.style.color = "red";

		btn.style.background = "#f7c5c5";
		btn.style.color = "#000";

		const correctBtn = allBtns.find(b => b.textContent === correctCapital.name);
		if (correctBtn) {
			correctBtn.style.background = "#c8f7c5";
			correctBtn.style.color = "#000";
			correctBtn.style.textDecoration = "underline";
			correctBtn.style.fontWeight = "bold";
		}
	}
}

// новый вопрос: выбираем столицу, генерим опции, загружаем фотки
async function newQuestion() {
	questionLocked = false;

	const res = document.getElementById("result");
	res.textContent = "";
	res.style.color = "#1c355e";

	// выбираем правильную столицу
	correctCapital = pickRandom(capitals);

	// берём три других случайных
	const others = capitals.filter(c => c.name !== correctCapital.name);
	const randomThree = shuffle(others).slice(0, 3).map(c => c.name);

	// собрали варианты и перемешали
	options = shuffle([correctCapital.name, ...randomThree]);

	// нарисовали кнопки
	renderAnswers();

	// загрузили фотки
	await loadImages(correctCapital.tags);
}

document.getElementById("next").addEventListener("click", () => {
	newQuestion();
});

newQuestion();