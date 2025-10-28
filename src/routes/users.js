import express from 'express';
import { 
  basicAuth, 
  validateUserInput, 
  checkResourceExists 
} from '../middlewares/index.js';

const router = express.Router();

// Імітація бази даних користувачів
const validUserIds = ['123', '456', '789'];

// GET /users - отримати всіх користувачів (з автентифікацією)
router.get('/', basicAuth, (req, res) => {
  res.status(200).send('Get users route');
});

// POST /users - створити нового користувача (з автентифікацією та валідацією)
router.post('/', basicAuth, validateUserInput, (req, res) => {
  res.status(201).send('Post users route');
});

// GET /users/:userId - отримати користувача за ID (з автентифікацією)
router.get('/:userId', basicAuth, checkResourceExists(validUserIds), (req, res) => {
  const { userId } = req.params;
  res.status(200).send(`Get user by Id route: ${userId}`);
});

// PUT /users/:userId - оновити користувача за ID (з автентифікацією та валідацією)
router.put('/:userId', basicAuth, checkResourceExists(validUserIds), validateUserInput, (req, res) => {
  const { userId } = req.params;
  res.status(200).send(`Put user by Id route: ${userId}`);
});

// DELETE /users/:userId - видалити користувача за ID (з автентифікацією)
router.delete('/:userId', basicAuth, checkResourceExists(validUserIds), (req, res) => {
  res.status(204).send();
});

export default router;