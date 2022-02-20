const express = require('express')
const router = express.Router()

const webScraperRouter = require('./webScraper/webScraper.router')

router.use('/web-scraper', webScraperRouter)

module.exports = router