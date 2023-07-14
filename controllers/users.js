const mongoose = require('mongoose');
const userModel = require('../models/user');
const { badRequest, notFound, internalServerError } = require('../errors/errorStatuses');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch(() => res.status(internalServerError).send({
      message: 'Произошла ошибка на сервере',
    }));
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .orFail(() => { throw new Error('Not found'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(notFound).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Ошибка валидации' });
      } else {
        res.status(internalServerError).send({ message: 'Произошла ошибка на сервере' });
      }
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.send(user);
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

const updateUser = (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.send(user);
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

const updateAvatar = (req, res) => {
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      res.send(user);
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
