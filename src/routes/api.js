"use strict";

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.js');

router.get('/', apiController.get);

module.exports = router;