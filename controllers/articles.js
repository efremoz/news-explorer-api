const Article = require('../models/article');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  NOT_FOUND_ARTICLE_ERROR,
  NOT_FOUND_ARTICLES_ERROR,
  FORBIDEN_ARTICLE_ERROR,
} = require('../constants/constants');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_ARTICLES_ERROR);
    })
    .then((articles) => res.status(200).send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const owner = req.user._id;
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => res.status(201).send({ dataAdd: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(err.message));
      }
      return next(err);
    });
};


const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findOne({ _id: articleId })
    .select('+owner')
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_ARTICLE_ERROR);
    })
    .then((articleInfo) => {
      if (!articleInfo.owner.equals(req.user._id)) {
        throw new UnauthorizedError(FORBIDEN_ARTICLE_ERROR);
      }
      Article.findByIdAndRemove(articleId)
        .then((articleRemove) => res.send({ dataRemove: articleRemove }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
