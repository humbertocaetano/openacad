const express = require('express');
const router = express.Router();
const { getTeachers } = require('../controllers/teachers.controller');

router.get('/', getTeachers);

module.exports = router;
