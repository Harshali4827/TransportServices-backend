const express = require('express');

const {
    getPendingCustomers
} = require('../controllers/notifyController');

const router = express.Router();

router.get('/notify/pending', getPendingCustomers);


module.exports = router;
