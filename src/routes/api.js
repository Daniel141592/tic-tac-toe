"use strict";

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.js');

router.use(express.json());
router.get('/', apiController.get);
router.get('/rooms/:id/check', apiController.check, apiController.send);

router.post('/rooms/:id/join', apiController.check, apiController.joinRoom);
router.post('/rooms/create', apiController.create);
router.post('/rooms/update', apiController.updateRoom);

module.exports = router;