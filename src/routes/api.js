"use strict";

import express from 'express';
const router = express.Router();
import * as apiController from '../controllers/api.js';

router.use(express.json());
router.get('/', apiController.get);
router.get('/rooms/:id/check', apiController.check, apiController.send);

router.post('/rooms/:id/join', apiController.check, apiController.joinRoom);
router.post('/rooms/create', apiController.create);
router.post('/rooms/update', apiController.updateRoom);

export default router;