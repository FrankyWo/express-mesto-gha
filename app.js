const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true })
  .then(() => console.log('Подключение к базе данных успешно'))
  .catch((err) => {
    console.log('Ошибка подключения к базе данных', err);
    process.exit(1);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '647d7d35a2022fdbfec5cd02',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log('Сервер запущен на порту 3000');
});
