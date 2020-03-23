const Article = require('../models/article');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  NOT_FOUND_ERROR,
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
    .then((article) => res.status(201).send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(err.message));
      }
      return next(err);
    });
};


const deleteArticle = (req, res, next) => {
  const ownerId = req.user._id;
  const { articleId } = req.params;

  if (!articleId) {
    throw new NotFoundError(NOT_FOUND_ERROR);
  }

  Article.findById(articleId)
    .then((articleInfo) => {
      if (articleInfo) {
        if (articleInfo.owner.toString() === ownerId) {
          Article.findByIdAndRemove(articleId)
            .then((articleRemove) => res.send({ data: articleRemove }))
            .catch(next);
        } else {
          throw new UnauthorizedError(FORBIDEN_ARTICLE_ERROR);
        }
      } else {
        throw new NotFoundError(NOT_FOUND_ARTICLE_ERROR);
      }
    })
    .catch(next);
};


module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
