const express = require('express');
const mangoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mangoose.model('Track');

const router = express.Router();
router.use(requireAuth);

router.get('/tracks', async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  const tracks = await Track.find({ userId: _id });
  res.send(tracks);
});

router.post('/tracks', async (req, res) => {
  const { name, locations } = req.body;
  const { _id } = req.user;

  if(!name || !locations) {
    return res.status(422).send({ error: 'Pls provide name and locations!' });
  };

  try {
    const track = new Track({ userId: _id, name, locations });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  };
});

module.exports = router;