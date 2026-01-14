# Quick Start - Anonymous Authentication

## Включите Anonymous Auth в Supabase

1. Откройте ваш проект в Supabase
2. **Authentication** → **Providers**
3. Найдите **Anonymous** 
4. Включите переключатель **Enable anonymous sign-ins**
5. Нажмите **Save**

## Проверка

После включения anonymous auth:

```bash
npm run dev
```

Откройте http://localhost:5173/CinemaTape/

Вы должны увидеть toast уведомление: **"Connected to cloud storage!"**

## Как это работает

- При первом входе автоматически создается анонимный пользователь
- Данные привязываются к этому пользователю
- User ID сохраняется в браузере
- Никакой регистрации или email не требуется

## Проверка в Supabase

1. **Authentication** → **Users**
2. Вы увидите анонимного пользователя с ID
3. **Table Editor** → **watched_films**
4. Добавьте фильм в приложении
5. Обновите таблицу - должна появиться запись

## Если не работает

### Проверьте .env файл

Убедитесь что файл `.env` существует и содержит:
```
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_ключ
```

### Проверьте консоль браузера (F12)

Должны быть запросы к Supabase:
- `POST /auth/v1/signup` (создание анонимного пользователя)
- `POST /rest/v1/watched_films` (добавление фильма)

### Проверьте RLS

В Supabase SQL Editor выполните:
```sql
SELECT * FROM watched_films;
```

Если видите данные - RLS настроен правильно.

## Ограничения Free tier

- ✅ 50,000 Monthly Active Users
- ✅ 500MB Database space
- ✅ 1GB File storage
- ✅ 2GB Bandwidth

Идеально для личного использования!
