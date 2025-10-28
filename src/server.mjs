import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import usersRouter from './routes/users.js';
import articlesRouter from './routes/articles.js';
import { logRequests } from './middlewares/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Налаштування шаблонізаторів
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug'); // За замовчуванням PUG

// Middleware для встановлення view engine залежно від маршруту
app.use('/articles/page*', (req, res, next) => {
  app.set('view engine', 'ejs');
  next();
});

app.use('/users/page*', (req, res, next) => {
  app.set('view engine', 'pug');
  next();
});

// Middleware для парсингу JSON
app.use(express.json());

// Middleware для статичних файлів (CSS)
app.use(express.static(join(__dirname, 'public')));

// Глобальний middleware для логування всіх запитів
app.use(logRequests);

// Кореневий маршрут (з логуванням)
app.get('/', (req, res) => {
  res.render('index', { title: 'Головна сторінка' });
});

// Підключення роутерів
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

// Обробка неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Глобальна обробка помилок (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

// Експорт для тестів
export { server, app };