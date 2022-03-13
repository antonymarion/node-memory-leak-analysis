'use strict';

const express = require('express');
const testController = require('../controllers/test_controller');

const router = express.Router();

router.route('/:parameter1/:parameter2').get(testController.test);

module.exports = router;
