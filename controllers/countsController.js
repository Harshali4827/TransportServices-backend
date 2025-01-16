const { Op,fn,col } = require('sequelize');
const Order = require("../models/Order");
const OrderPaymentsSummary = require("../models/OrderPaymentSummary");
const Vehicle = require("../models/vehicle");
const moment = require('moment');
const Expense = require('../models/Expense');
const Customer = require('../models/Customer');
const sequelize = require('../config/db');

// Get counts for active and completed orders
exports.getOrderCounts = async (req, res) => {
    try {
      const activeOrdersCount = await Order.count({ where: { Status: 'Active' } });
      const completedOrdersCount = await Order.count({ where: { Status: 'Completed' } });
      
      res.status(200).json({
        activeOrders: activeOrdersCount,
        completedOrders: completedOrdersCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch order counts' });
    }
  };
  
// Get counts for available and total vehicles
exports.getVehiclesCounts = async (req, res) => {
    try {
      const availableVehicleCount = await Vehicle.count({ where: { Availability: 'Available' } });
      const unavailableVehicleCount = await Vehicle.count({ where: { Availability: 'Unavailable' } });
      const totalVehicleCount = await Vehicle.count();
  
      res.status(200).json({
        availableVehicles: availableVehicleCount,
        unavailableVehicles: unavailableVehicleCount,
        totalVehicles: totalVehicleCount
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch vehicle counts' });
    }
  };

//Calculate Pending Payments

exports.getPendingPayments = async (req, res) => {
  try {
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

    const totalPendingPayments = await OrderPaymentsSummary.sum('RemainingBalance', {
      where: {
        Status: 'Pending',
      },
    });
    const pendingPaymentsThisMonth = await OrderPaymentsSummary.sum('RemainingBalance', {
      where: {
        Status: 'Pending',
        createdAt: {
          [Op.gte]: startOfMonth, 
          [Op.lte]: endOfMonth,  
        },
      },
      
    });

    res.status(200).json({
      totalPendingPayments: totalPendingPayments || 0,
      pendingPaymentsThisMonth: pendingPaymentsThisMonth || 0,
    });
  } catch (error) {
    console.error('Error calculating pending payments:', error);
    res.status(500).json({ error: 'Failed to calculate pending payments' });
  }
};
  

// Calculate total income and total expense
exports.getFinancialSummary = async (req, res) => {
    try {
      const totalIncome = await OrderPaymentsSummary.sum('TotalPaid');
      const totalExpense = await Expense.sum('Amount');
  
      res.status(200).json({
        totalIncome: totalIncome || 0, 
        totalExpense: totalExpense || 0,
      });
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      res.status(500).json({ error: 'Failed to fetch financial summary' });
    }
  };

  //get vehicles data
  exports.getVehicleUsageStats = async (req, res) => {
    try {
      const vehicleStats = await Order.findAll({
        attributes: [
          'VehicleID',
          [fn('SUM', col('HoursUsed')), 'totalHoursUsed'],
          [fn('SUM', col('TotalTrip')), 'totalTrips'],
          [fn('SUM', col('DistanceCovered')), 'totalDistanceCovered'],
          [fn('SUM', col('TotalAmount')), 'totalRevenue'],
        ],
        group: ['VehicleID'],
        include: [
          {
            model: Vehicle,
            as: 'Vehicle', 
            attributes: ['RegistrationNo', 'VehicleType','VehicleName'],
          },
        ],
      });
  
      res.status(200).json(vehicleStats);
    } catch (error) {
      console.error('Error fetching vehicle usage statistics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.getCustomerCounts = async (req, res) => {
    try {
      // Count total customers
      const totalCustomers = await Customer.count();
  
      // Count customers by payment status
      const statusCounts = await OrderPaymentsSummary.findAll({
        attributes: [
          'Status',
          [sequelize.fn('COUNT', sequelize.col('CustomerID')), 'count'],
        ],
        group: ['Status'],
      });
  
      // Convert status counts to a more readable format
      const statusData = {};
      statusCounts.forEach((status) => {
        statusData[status.Status] = status.get('count');
      });
  
      res.status(200).json({
        totalCustomers,
        statusCounts: statusData,
      });
    } catch (error) {
      console.error('Error fetching customer counts:', error);
      res.status(500).json({ error: 'Failed to fetch customer counts' });
    }
  };

  exports.getOrdersSummary = async (req, res) => {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
      const ordersData = await Order.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('StartDate'), '%Y-%m'), 'Month'],
          [sequelize.fn('COUNT', sequelize.col('OrderID')), 'TotalOrders'],
          [sequelize.literal(`SUM(CASE WHEN Status = 'Active' THEN 1 ELSE 0 END)`), 'ActiveOrders'],
          [sequelize.literal(`SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END)`), 'CompletedOrders'],
        ],
        where: {
          StartDate: {
            [Op.gte]: sixMonthsAgo,
          },
        },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('StartDate'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('StartDate'), '%Y-%m'), 'ASC']],
      });
  
      res.status(200).json(ordersData);
    } catch (error) {
      console.error('Error fetching orders summary:', error);
      res.status(500).json({ error: 'Failed to fetch orders summary' });
    }
  };