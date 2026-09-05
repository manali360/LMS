const express = require('express');
const { getCertificate, verifyCertificate } = require('../controllers/certificateController');

const router = express.Router();

router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id', getCertificate);

module.exports = router;
