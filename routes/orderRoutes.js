const express = require('express');

const {
  addOrder,
  getOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/orders', addOrder);
router.get('/orders', getOrders);
router.get('/orders/:OrderID', getOrderById);
router.get('/orders/customer/:customerName', getOrdersByCustomer);
router.put('/orders/:OrderID', updateOrder);
router.delete('/orders/:OrderID', deleteOrder);

module.exports = router;
