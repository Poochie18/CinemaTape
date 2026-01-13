# Архітектура проєкту КіноЛітопис

## 📁 Структура файлів

```
CinemaTape/
├── public/
│   └── film.svg                    # Іконка додатку
├── src/
│   ├── components/
│   │   ├── AddMovieModal.jsx       # Модальне вікно додавання/редагування фільму
│   │   ├── Calendar.jsx            # Головний компонент календаря
│   │   ├── DayFilms.jsx            # Список фільмів за обраний день
│   │   ├── EmptyState.jsx          # Компонент порожнього стану
│   │   ├── LoadingSpinner.jsx      # Індикатор завантаження
│   │   ├── Modal.jsx               # Базовий компонент модального вікна
│   │   ├── MoveToWatchedModal.jsx  # Модальне вікно переміщення з "На потім"
│   │   ├── MovieSearch.jsx         # Компонент пошуку фільмів
│   │   ├── StarRating.jsx          # Компонент зіркового рейтингу
│   │   ├── Statistics.jsx          # Сторінка статистики
│   │   └── WatchLater.jsx          # Список "На потім"
│   ├── services/
│   │   └── tmdb.js                 # Сервіс роботи з TMDb API
│   ├── App.jsx                     # Головний компонент додатку
│   ├── db.js                       # Налаштування IndexedDB (Dexie)
│   ├── index.css                   # Глобальні стилі та Tailwind
│   └── main.jsx                    # Точка входу React
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── QUICKSTART.md
└── TIPS.md
```

## 🏗️ Архітектурні рішення

### State Management
- **Локальний стан**: React useState/useEffect
- **База даних**: IndexedDB через Dexie.js
- **Reactive запити**: dexie-react-hooks (useLiveQuery)

### Переваги цього підходу:
- Автоматична синхронізація UI при змінах в БД
- Не потрібні глобальні state менеджери (Redux, MobX)
- Проста та зрозуміла архітектура

### Потік даних

```
User Action → Component Handler → Database Operation → useLiveQuery → Re-render
```

**Приклад:**
```javascript
// 1. Користувач додає фільм
handleAddWatchedFilm(filmData)
  
// 2. Запис в БД
await db.watchedFilms.add(filmData)

// 3. useLiveQuery автоматично оновлює дані
const watchedFilms = useLiveQuery(() => db.watchedFilms.toArray())

// 4. React ре-рендерить компоненти з новими даними
```

## 🗄️ Структура бази даних (IndexedDB)

### Таблиця `watchedFilms`
```javascript
{
  id: number (auto-increment),
  tmdbId: number,
  title: string,
  originalTitle: string,
  poster: string (URL),
  posterSmall: string (URL),
  year: number,
  overview: string,
  watchDate: string (ISO date),
  rating: number (0-10),
  note: string
}
```

### Таблиця `watchLater`
```javascript
{
  id: number (auto-increment),
  tmdbId: number,
  title: string,
  originalTitle: string,
  poster: string (URL),
  posterSmall: string (URL),
  year: number,
  overview: string,
  addedAt: string (ISO date)
}
```

### Індекси
- `watchedFilms`: по `watchDate` та `rating` для швидкої фільтрації
- `watchLater`: по `addedAt` для сортування

## 🎨 Система стилізації

### Tailwind CSS + Custom Classes

**Кастомні utility класи (index.css):**
```css
.glass              # Скляний морфізм ефект
.glass-hover        # Скляний ефект з ховером
.btn-primary        # Основна кнопка з градієнтом
.btn-secondary      # Вторинна кнопка
.input-field        # Стилізоване поле вводу
.card               # Карточка
.neon-glow          # Неонове світіння
```

### Кольорова палітра
```javascript
neon: {
  purple: '#A78BFA',
  pink: '#F472B6',
  blue: '#60A5FA',
}
```

### Анімації (Framer Motion)
- Fade in/out для модальних вікон
- Slide up для карточок
- Scale для інтерактивних елементів
- Кастомні анімації в Tailwind config

## 🔌 Інтеграція з TMDb API

### Ендпоінти
1. **Пошук фільмів**: `/search/movie`
2. **Деталі фільму**: `/movie/{id}`

### Обробка даних
```javascript
// Трансформація відповіді TMDb → наш формат
{
  tmdbId: movie.id,
  title: movie.title,
  year: new Date(movie.release_date).getFullYear(),
  poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  // ...
}
```

### Оптимізація
- Дебаунсинг пошуку (300мс)
- Обмеження результатів (10 фільмів)
- Кешування в компоненті MovieSearch

## 📦 Компоненти

### Структура компонентів

```
App (root)
├── Header (navigation, tabs, export/import)
├── Calendar View
│   ├── Calendar
│   └── DayFilms
│       └── MovieCard (with edit/delete)
├── Watch Later View
│   ├── MovieSearch
│   └── WatchLaterGrid
│       └── MovieCard (with move-to-watched)
└── Statistics View
    ├── StatsCards
    ├── MonthlyChart
    └── TopRatedGrid
```

### Переиспользуемые компоненты

**Modal** - базовий компонент модального вікна
- Props: `isOpen`, `onClose`, `title`, `size`, `children`
- Features: backdrop, animations, auto-scroll lock

**StarRating** - зірковий рейтинг
- Props: `rating`, `onRatingChange`, `readonly`, `size`
- Features: hover preview, click to rate

**MovieSearch** - пошук фільмів
- Props: `onSelectMovie`, `onAddToWatchLater`, `placeholder`
- Features: debounced search, TMDb integration, dropdown results

**EmptyState** - порожній стан
- Props: `icon`, `title`, `description`, `action`
- Universal для всіх пустих екранів

## 🚀 Оптимізація продуктивності

### React
- `useMemo` для важких обчислень (статистика)
- `useCallback` для стабільних посилань на функції
- Мінімальна кількість ре-рендерів

### IndexedDB
- Індекси для швидкого пошуку
- Batch операції для імпорту
- `useLiveQuery` - ефективна підписка на зміни

### Завантаження зображень
- Lazy loading постерів
- Різні розміри (w200, w500) залежно від контексту
- Fallback для відсутніх постерів

## 🔐 Безпека

### Клієнтська безпека
- API ключ TMDb в коді (публічний ключ, обмежений доменом в production)
- Валідація даних перед записом в БД
- XSS захист через React (автоматичний escape)

### Дані користувача
- Локальне зберігання (IndexedDB)
- Експорт/імпорт для резервного копіювання
- Немає відправки даних на сервер

## 📱 Адаптивність

### Breakpoints (Tailwind)
- `sm:` 640px - маленькі планшети
- `md:` 768px - планшети
- `lg:` 1024px - ноутбуки
- `xl:` 1280px - великі екрани

### Mobile-first підхід
- Базові стилі для мобільних
- Progressive enhancement для великих екранів
- Touch-friendly кнопки та інтеракції

## 🛠️ Розширення функціоналу

### Як додати нову функцію

1. **Нова таблиця в БД:**
```javascript
// db.js
this.version(2).stores({
  watchedFilms: '++id, tmdbId, title, watchDate, rating',
  watchLater: '++id, tmdbId, title, addedAt',
  newTable: '++id, field1, field2' // додати тут
});
```

2. **Новий компонент:**
```javascript
// src/components/NewComponent.jsx
import { motion } from 'framer-motion';

export default function NewComponent({ prop1, prop2 }) {
  return (
    <motion.div className="glass rounded-xl p-6">
      {/* контент */}
    </motion.div>
  );
}
```

3. **Інтеграція в App.jsx:**
```javascript
import NewComponent from './components/NewComponent';

// в render:
{activeTab === 'newTab' && <NewComponent />}
```

### Ідеї для розширення

- 🎭 Категорії/жанри з фільтрацією
- 👥 Список улюблених акторів/режисерів
- 🎥 Підтримка серіалів
- 📱 PWA для офлайн роботи
- 🌐 Мультимовність
- 🎨 Теми оформлення
- 📊 Більше графіків та аналітики
- 🔄 Синхронізація між пристроями (через власний бекенд)
- 🎬 Інтеграція з іншими API (IMDb, Kinopoisk)
- 📝 Експорт в PDF/Markdown

## 🧪 Тестування (майбутнє)

Рекомендації для додавання тестів:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Що тестувати:**
- Utility функції (дати, фільтри)
- Компоненти (render, interactions)
- DB операції (mock Dexie)
- TMDb сервіс (mock fetch)

## 📝 Code Style

### Conventions
- PascalCase для компонентів
- camelCase для функцій та змінних
- Functional components + hooks
- Destructuring props
- Early returns

### Коментарі
```javascript
// Описові коментарі для складних блоків
{/* JSX коментарі для розмітки */}
```

## 🚢 Deployment

### Статичний хостинг (Vercel, Netlify, GitHub Pages)

1. **Build:**
```bash
npm run build
```

2. **Результат:** папка `dist/`

3. **Важливо:**
   - Замінити API ключ на production ключ з обмеженням домену
   - Налаштувати redirect для SPA (`_redirects` або `vercel.json`)

### Docker (опційно)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

**Happy Coding! 🎬💻**
