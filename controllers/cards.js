const mongoose = require('mongoose');
const cardModel = require('../models/card');
const { badRequest, notFound, internalServerError } = require('../errors/errorStatuses');

const getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(internalServerError).send({
      message: 'Произошла ошибка на сервере',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
        return;
      }
      res.status(internalServerError).send({
        message: 'Произошла ошибка на сервере',
      });
    });
};

const deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .orFail(() => { throw new Error('Not found'); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const setLike = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => { throw new Error('Not found'); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const deleteLike = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => { throw new Error('Not found'); })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFound).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  deleteLike,
};
