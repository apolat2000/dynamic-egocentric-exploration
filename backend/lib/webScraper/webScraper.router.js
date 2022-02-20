const express = require('express');
const router = express.Router();
const controller = require('./webScraper.controller');

router.get('/', controller.indexAction);

router.post('/get-neighboring-web-pages-as-graph', controller.getGraphAction);

module.exports = router;
