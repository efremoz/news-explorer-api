const articles = require('express').Router();

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

const { articleCheck, articleIdCheck } = require('../modules/validations');

articles.get('/', getArticles);
articles.post('/', articleCheck, createArticle);
articles.delete('/:articleId', articleIdCheck, deleteArticle);

module.exports = articles;
