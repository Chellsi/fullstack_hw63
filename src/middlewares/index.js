// Middleware для логування запитів
export function logRequests(req, res, next) {
    console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`);
    next();
  }
  
  // Middleware для базової автентифікації
  export function basicAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).send('Access denied. No credentials sent.');
    }
    
    // Перевірка формату "Bearer token"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. Invalid token format.');
    }
    
    // Тут можна додати логіку перевірки токена
    // Для прикладу, просто перевіряємо чи токен не порожній
    req.user = { id: '123', role: 'admin' }; // Симуляція користувача
    next();
  }
  
  // Middleware для валідації даних користувача
  export function validateUserInput(req, res, next) {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).send('Bad Request');
    }
    
    next();
  }
  
  // Middleware для валідації даних статті
  export function validateArticleInput(req, res, next) {
    const { title } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).send('Bad Request');
    }
    
    next();
  }
  
  // Middleware для перевірки прав доступу до статей
  export function checkArticleAccess(req, res, next) {
    const user = req.user;
    
    // Перевіряємо чи користувач аутентифікований
    if (!user) {
      return res.status(401).send('Access denied. Authentication required.');
    }
    
    // Перевіряємо чи користувач має права доступу
    // Для прикладу, дозволяємо доступ тільки адмінам та авторам
    if (user.role !== 'admin' && user.role !== 'author') {
      return res.status(403).send('Access denied. Insufficient permissions.');
    }
    
    next();
  }
  
  // Middleware для перевірки існування ресурсу
  export function checkResourceExists(validIds) {
    return (req, res, next) => {
      const id = req.params.userId || req.params.articleId;
      
      if (!validIds.includes(id)) {
        return res.status(404).send('Not Found');
      }
      
      next();
    };
  }