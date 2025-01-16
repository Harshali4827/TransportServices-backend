const express = require('express');
const {
    getAllOrderPaymentsSummaries,
  deleteOrderPaymentSummary,
  getPaymentByCustomerId
} = require('../controllers/ordersummaryController');

const router = express.Router();


router.get('/summary/orders', getAllOrderPaymentsSummaries);
router.delete('/summary/orders/:OrderID',deleteOrderPaymentSummary)
router.get('/summary/customer/:CustomerID', getPaymentByCustomerId);

module.exports = router;
