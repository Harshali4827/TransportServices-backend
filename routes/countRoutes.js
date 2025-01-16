const express = require('express');
const {
    getOrderCounts,
    getVehiclesCounts,
    getPendingPayments,
    getFinancialSummary,
    getVehicleUsageStats,
    getCustomerCounts,
    getOrdersSummary
} = require('../controllers/countsController');


const router = express.Router();

router.get('/count/orders', getOrderCounts);
router.get('/count/vehicles', getVehiclesCounts);
router.get('/count/payments',getPendingPayments);
router.get('/count/income',getFinancialSummary);
router.get('/count/vehicle/all-data',getVehicleUsageStats );
router.get('/count/customers',getCustomerCounts);
router.get('/count/orders/summary', getOrdersSummary);

module.exports = router;
