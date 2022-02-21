// ENV Configuration
require('dotenv').config();

// load external modules
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

// load internal modules
const router = require('./lib/router');

// init express
const app = express();

// cors
app.use(cors());
app.options('*', cors());

// body parsing
app.use(express.json()); //Used to parse JSON bodies

// Setup compression for response bodies
app.use(compression());

// Setup helmet for application security
app.use(helmet());

// Setup demo index route
app.get('/', function (req, res) {
  res.json({
    status: 'Its alive',
  });
});

// Setup API router => /api/v1
app.use('/api/v1', router);

app.listen(process.env.APP_PORT || 8000, () => {
  console.log(`Server started on port ${process.env.APP_PORT}`);
});
