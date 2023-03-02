require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('../db');
const Blinks = require('../db/Blinks');

//const path = require('path');

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// app.use(express.static(path.join(__dirname, '/dist')));

app.post('/api', async (req, res) => {
  let data = req.body;
  try {
    // const newBlinkData = new Blinks(data);
    // newBlinkData.save();
    console.log('Added to MongoDB');
    res.status(201).send();
  } catch (err) {
    console.log('Could not add data to MongoDB');
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
