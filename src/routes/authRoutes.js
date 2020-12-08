const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, resp) => {
  const { email, password } = req.body;
  
  try {
    const user = new User({email, password});
    await user.save();

    const token = jwt.sign({ userId: user._id }, 'secret_key');
    resp.send({ token });
  } catch(error) {
    return resp.status(422).send(error.message);
  };
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(422).send({ error: 'Please provide email or password!' });
  };

  const user = await User.findOne({ email });
  if(!user) {
    return res.status(422).send({ error: 'Email not found!' });
  };

  try {
    await user.comparePasswords(password);
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    res.send({ token });
  } catch(err) {
    return res.status(422).send({ error: 'Invalid email or password!' });
  };

});

module.exports = router;