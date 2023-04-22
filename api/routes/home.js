const express = require("express")

const router = express.Router()

const homeController = require('../controllers/home_controller.js').home

router.get('/',homeController)

module.exports = router