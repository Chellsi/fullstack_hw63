import express from 'express';
import { 
  basicAuth, 
  validateArticleInput, 
  checkArticleAccess,
  checkResourceExists 
} from '../middlewares/index.js';

const router = express.Router();

// Імітація бази даних статей
const validArticleIds = ['456', '789', '101'];

// GET /articles - отримати всі статті (з автентифікацією та перевіркою прав)
router.get('/', basicAuth, checkArticleAccess, (req, res) => {
  res.status(200).send('Get articles route');
});

// POST /articles - створити нову статтю (з автентифікацією, перевіркою прав та валідацією)
router.post('/', basicAuth, checkArticleAccess, validateArticleInput, (req, res) => {
  res.status(201).send('Post articles route');
});

// GET /articles/:articleId - отримати статтю за ID (з автентифікацією та перевіркою прав)
router.get('/:articleId', basicAuth, checkArticleAccess, checkResourceExists(validArticleIds), (req, res) => {
  const { articleId } = req.params;
  res.status(200).send(`Get article by Id route: ${articleId}`);
});

// PUT /articles/:articleId - оновити статтю за ID (з автентифікацією, перевіркою прав та валідацією)
router.put('/:articleId', basicAuth, checkArticleAccess, checkResourceExists(validArticleIds), validateArticleInput, (req, res) => {
  const { articleId } = req.params;
  res.status(200).send(`Put article by Id route: ${articleId}`);
});

// DELETE /articles/:articleId - видалити статтю за ID (з автентифікацією та перевіркою прав)
router.delete('/:articleId', basicAuth, checkArticleAccess, checkResourceExists(validArticleIds), (req, res) => {
  res.status(204).send();
});

export default router;