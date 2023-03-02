const mongoose = require('mongoose');

const blinksSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  blinks: { type: Number, required: true },
  blinkTimes: { type: Array, required: true },
});

const Blinks = mongoose.model('Blinks', blinksSchema);

module.exports = Blinks;
