require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// app.use(express.static(path.join(__dirname, '/dist')));

app.get('/api', (req, res) => {
  // do something
  console.log('received request');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
