const { Op } = require('sequelize');
const OrderPaymentsSummary = require('../models/OrderPaymentSummary'); // Import model

// Controller to fetch customer names with 'Pending' status
exports.getPendingCustomers = async (req, res) => {
  try {
    const pendingCustomers = await OrderPaymentsSummary.findAll({
      where: {
        Status: 'Pending',
      },
      attributes: ['CustomerName'],
    });

    if (pendingCustomers.length === 0) {
      return res.status(404).json({ message: 'No pending customers found' });
    }

    const customerNames = pendingCustomers.map(payment => payment.CustomerName);

    res.status(200).json({ customers: customerNames });
  } catch (error) {
    console.error('Error fetching pending customers:', error);
    res.status(500).json({ error: 'Failed to fetch pending customers' });
  }
};
