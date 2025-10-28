# Express RESTful API з Middleware

RESTful API сервер з використанням Express.js, який включає систему middleware для логування, аутентифікації, валідації даних та управління правами доступу.

## 📋 Зміст

- [Технології](#технології)
- [Встановлення](#встановлення)
- [Запуск](#запуск)
- [Архітектура](#архітектура)
- [Middleware](#middleware)
- [Маршрути API](#маршрути-api)
- [Тестування](#тестування)
- [Приклади використання](#приклади-використання)

## 🛠 Технології

- **Node.js** - серверне середовище виконання
- **Express.js** - веб-фреймворк для Node.js
- **ES Modules** - сучасний синтаксис модулів JavaScript
- **Vitest** - фреймворк для тестування
- **Supertest** - бібліотека для тестування HTTP

## 📦 Встановлення

1. Клонуйте репозиторій:
```bash
git clone <your-repository-url>
cd fullstack_hw61
```

2. Встановіть залежності:
```bash
npm install
# або
yarn install
```

## 🚀 Запуск

### Режим розробки (з автоперезавантаженням):
```bash
npm run dev
```

### Режим продакшн:
```bash
npm start
```

Сервер буде доступний за адресою: `http://localhost:3000`

## 📁 Архітектура

Проект побудований за паттерном MVC з модульною структурою:

```
src/
├── middlewares/
│   └── index.js          # Всі middleware функції
├── routes/
│   ├── users.js          # Маршрути для користувачів
│   └── articles.js       # Маршрути для статей
├── __test__/
│   └── task1.test.js     # Тести
└── server.mjs            # Головний файл сервера
```

## 🔧 Middleware

### 1. **Логування запитів** (`logRequests`)
- **Призначення**: Записує інформацію про кожен запит до сервера
- **Використання**: Глобально для всіх маршрутів
- **Формат логу**: `2025-01-15T10:30:45.123Z - GET request to /users`

### 2. **Базова автентифікація** (`basicAuth`)
- **Призначення**: Перевіряє наявність та формат Authorization заголовка
- **Використання**: На маршрутах `/users` та `/articles`
- **Формат**: `Authorization: Bearer <token>`
- **Статус при помилці**: `401 Unauthorized`

### 3. **Валідація даних користувача** (`validateUserInput`)
- **Призначення**: Перевіряє наявність обов'язкового поля `name`
- **Використання**: На POST та PUT запитах до `/users`
- **Статус при помилці**: `400 Bad Request`

### 4. **Валідація даних статті** (`validateArticleInput`)
- **Призначення**: Перевіряє наявність обов'язкового поля `title`
- **Використання**: На POST та PUT запитах до `/articles`
- **Статус при помилці**: `400 Bad Request`

### 5. **Перевірка прав доступу** (`checkArticleAccess`)
- **Призначення**: Перевіряє права користувача для роботи зі статтями
- **Використання**: На всіх маршрутах `/articles`
- **Дозволені ролі**: `admin`, `author`
- **Статус при помилці**: `403 Forbidden`

### 6. **Перевірка існування ресурсу** (`checkResourceExists`)
- **Призначення**: Перевіряє чи існує ресурс з вказаним ID
- **Використання**: На маршрутах з параметром `:userId` або `:articleId`
- **Статус при помилці**: `404 Not Found`

## 🛣 Маршрути API

### Кореневий маршрут

#### `GET /`
- **Опис**: Кореневий маршрут сервера
- **Middleware**: `logRequests`
- **Відповідь**: `200 OK` - "Get root route"

---

### Маршрути користувачів

#### `GET /users`
- **Опис**: Отримати список всіх користувачів
- **Middleware**: `logRequests`, `basicAuth`
- **Заголовки**: `Authorization: Bearer <token>`
- **Відповідь**: `200 OK` - "Get users route"

#### `POST /users`
- **Опис**: Створити нового користувача
- **Middleware**: `logRequests`, `basicAuth`, `validateUserInput`
- **Заголовки**: `Authorization: Bearer <token>`
- **Тіло запиту**:
```json
{
  "name": "Ім'я користувача"
}
```
- **Відповідь**: `201 Created` - "Post users route"
- **Помилки**: 
  - `400 Bad Request` - некоректні дані
  - `401 Unauthorized` - відсутня автентифікація

#### `GET /users/:userId`
- **Опис**: Отримати користувача за ID
- **Middleware**: `logRequests`, `basicAuth`, `checkResourceExists`
- **Параметри**: `userId` - ID користувача (123, 456, 789)
- **Відповідь**: `200 OK` - "Get user by Id route: {userId}"
- **Помилки**: `404 Not Found` - користувач не знайдений

#### `PUT /users/:userId`
- **Опис**: Оновити користувача за ID
- **Middleware**: `logRequests`, `basicAuth`, `checkResourceExists`, `validateUserInput`
- **Параметри**: `userId` - ID користувача
- **Тіло запиту**:
```json
{
  "name": "Оновлене ім'я"
}
```
- **Відповідь**: `200 OK` - "Put user by Id route: {userId}"
- **Помилки**: 
  - `400 Bad Request` - некоректні дані
  - `404 Not Found` - користувач не знайдений

#### `DELETE /users/:userId`
- **Опис**: Видалити користувача за ID
- **Middleware**: `logRequests`, `basicAuth`, `checkResourceExists`
- **Параметри**: `userId` - ID користувача
- **Відповідь**: `204 No Content`
- **Помилки**: `404 Not Found` - користувач не знайдений

---

### Маршрути статей

#### `GET /articles`
- **Опис**: Отримати список всіх статей
- **Middleware**: `logRequests`, `basicAuth`, `checkArticleAccess`
- **Заголовки**: `Authorization: Bearer <token>`
- **Відповідь**: `200 OK` - "Get articles route"
- **Помилки**: `403 Forbidden` - недостатньо прав

#### `POST /articles`
- **Опис**: Створити нову статтю
- **Middleware**: `logRequests`, `basicAuth`, `checkArticleAccess`, `validateArticleInput`
- **Заголовки**: `Authorization: Bearer <token>`
- **Тіло запиту**:
```json
{
  "title": "Назва статті"
}
```
- **Відповідь**: `201 Created` - "Post articles route"
- **Помилки**: 
  - `400 Bad Request` - некоректні дані
  - `403 Forbidden` - недостатньо прав

#### `GET /articles/:articleId`
- **Опис**: Отримати статтю за ID
- **Middleware**: `logRequests`, `basicAuth`, `checkArticleAccess`, `checkResourceExists`
- **Параметри**: `articleId` - ID статті (456, 789, 101)
- **Відповідь**: `200 OK` - "Get article by Id route: {articleId}"
- **Помилки**: 
  - `403 Forbidden` - недостатньо прав
  - `404 Not Found` - стаття не знайдена

#### `PUT /articles/:articleId`
- **Опис**: Оновити статтю за ID
- **Middleware**: `logRequests`, `basicAuth`, `checkArticleAccess`, `checkResourceExists`, `validateArticleInput`
- **Параметри**: `articleId` - ID статті
- **Тіло запиту**:
```json
{
  "title": "Оновлена назва статті"
}
```
- **Відповідь**: `200 OK` - "Put article by Id route: {articleId}"
- **Помилки**: 
  - `400 Bad Request` - некоректні дані
  - `403 Forbidden` - недостатньо прав
  - `404 Not Found` - стаття не знайдена

#### `DELETE /articles/:articleId`
- **Опис**: Видалити статтю за ID
- **Middleware**: `logRequets`, `basicAuth`, `checkArticleAccess`, `checkResourceExists`
- **Параметри**: `articleId` - ID статті
- **Відповідь**: `204 No Content`
- **Помилки**: 
  - `403 Forbidden` - недостатньо прав
  - `404 Not Found` - стаття не знайдена

---

### Обробка помилок

#### Неіснуючий маршрут
- **Відповідь**: `404 Not Found` - "Not Found"

#### Внутрішня помилка сервера
- **Відповідь**: `500 Internal Server Error` - "Internal Server Error"

## 🧪 Тестування

Запуск тестів:
```bash
npm test
```

Тести покривають:
- ✅ Всі маршрути API
- ✅ Валідацію даних
- ✅ Обробку помилок
- ✅ Статус-коди відповідей

## 📝 Приклади використання

### Використання з curl

#### Отримати кореневий маршрут:
```bash
curl http://localhost:3000/
```

#### Отримати список користувачів (з автентифікацією):
```bash
curl -H "Authorization: Bearer your-token" http://localhost:3000/users
```

#### Створити нового користувача:
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Іван Петренко"}'
```

#### Отримати користувача за ID:
```bash
curl -H "Authorization: Bearer your-token" http://localhost:3000/users/123
```

#### Оновити користувача:
```bash
curl -X PUT http://localhost:3000/users/123 \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Петро Іваненко"}'
```

#### Видалити користувача:
```bash
curl -X DELETE http://localhost:3000/users/123 \
  -H "Authorization: Bearer your-token"
```

#### Створити статтю:
```bash
curl -X POST http://localhost:3000/articles \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Моя перша стаття"}'
```

### Використання з Postman

1. Створіть новий запит
2. Виберіть метод (GET, POST, PUT, DELETE)
3. Введіть URL: `http://localhost:3000/users` або `http://localhost:3000/articles`
4. У вкладці **Headers** додайте:
   - Key: `Authorization`
   - Value: `Bearer your-token`
5. Для POST/PUT запитів у вкладці **Body** виберіть **raw** та **JSON**, додайте дані:
```json
{
  "name": "Тестовий користувач"
}
```

## 🔒 Безпека

Проект включає базові механізми безпеки:

- **Автентифікація**: Перевірка Authorization заголовка
- **Авторизація**: Контроль прав доступу до ресурсів
- **Валідація**: Перевірка вхідних даних
- **Обробка помилок**: Централізована обробка помилок

> ⚠️ **Важливо**: Це навчальний проект. Для продакшн використання необхідно додати:
> - Реальну систему автентифікації (JWT, OAuth)
> - Шифрування паролів
> - HTTPS
> - Rate limiting
> - CORS політику
> - Базу даних