const express = require('express');
const {
  addPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getLatestRemainingBalance,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/payments', addPayment);
router.get('/payments', getPayments);
router.get('/payments/:PaymentID', getPaymentById);
router.get('/payments/latest/:OrderID',getLatestRemainingBalance);
// router.get('/payments/customer/:CustomerID', getPaymentByCustomerId);
router.put('/payments/:PaymentID', updatePayment);
router.delete('/payments/:PaymentID', deletePayment);

module.exports = router;
