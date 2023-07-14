const router = require('express').Router();
const cardRouter = require('./cards');
const userRouter = require('./users');

router.use('/cards', cardRouter);
router.use('/users', userRouter);
router.use((req, res) => {
  res.status(404).send({ message: 'Not found' });
});

module.exports = router;
