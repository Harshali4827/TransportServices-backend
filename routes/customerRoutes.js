const express = require('express');
const {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const router = express.Router();

router.post('/customers', addCustomer);
router.get('/customers', getCustomers);
router.get('/customers/:CustomerID', getCustomerById);
router.put('/customers/:CustomerID', updateCustomer);
router.delete('/customers/:CustomerID', deleteCustomer);

module.exports = router;
