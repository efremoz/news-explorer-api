const articles = require('express').Router();

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articles.get('/', getArticles);
articles.post('/', createArticle);
articles.delete('/:articleId', deleteArticle);

module.exports = articles;
