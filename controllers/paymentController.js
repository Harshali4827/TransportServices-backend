const Payment = require('../models/Payment');
const Order = require('../models/Order');
const OrderPaymentsSummary = require('../models/OrderPaymentSummary');

// Add a new payment
// exports.addPayment = async (req, res) => {
//   const { OrderID, CustomerName, AmountPaid, PaymentMethod, PaymentDate } = req.body;

//   try {
//     const order = await Order.findByPk(OrderID);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     const latestPayment = await Payment.findOne({
//       where: { OrderID },
//       order: [['createdAt', 'DESC']],
//     });

//     let remainingBalance;

//     if (latestPayment) {
//       remainingBalance = latestPayment.RemainingBalance - AmountPaid;
//     } else {
//       remainingBalance = order.TotalAmount - AmountPaid;
//     }

//     if (remainingBalance < 0) {
//       return res.status(400).json({ error: 'Amount paid exceeds remaining balance' });
//     }

//     const status =
//       remainingBalance === 0
//         ? "Paid"
//         : remainingBalance > 0 && remainingBalance < order.TotalAmount
//         ? "Partially Paid"
//         : remainingBalance === order.TotalAmount
//         ? "Pending"
//         : "Overpaid";

//     const payment = await Payment.create({
//       OrderID,
//       CustomerID: order.CustomerID,
//       CustomerName,
//       OrderNo: order.OrderNo,
//       TotalAmount: order.TotalAmount,
//       AmountPaid,
//       PaymentMethod,
//       PaymentDate,
//       RemainingBalance: remainingBalance,
//       Status: status,
//     });

//     res.status(201).json(payment);
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     res.status(500).json({ error: 'Failed to create payment' });
//   }
// };


exports.addPayment = async (req, res) => {
  const { OrderID, CustomerName, AmountPaid, PaymentMethod, PaymentDate } = req.body;

  try {
    const order = await Order.findByPk(OrderID);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const latestSummary = await OrderPaymentsSummary.findOne({
      where: { OrderID },
    });

    let totalPaid = 0;
    let remainingBalance = 0;

    if (latestSummary) {
      totalPaid = latestSummary.TotalPaid + AmountPaid;
      remainingBalance = latestSummary.RemainingBalance - AmountPaid;
    } else {
      totalPaid = AmountPaid;
      remainingBalance = order.TotalAmount - AmountPaid;
    }
    if (remainingBalance < 0) {
      return res.status(400).json({ error: 'Overpayment is not allowed' });
    }

    const status = remainingBalance === 0 ? 'Paid' : 'Partially Paid';
    const payment = await Payment.create({
      OrderID,
      CustomerID: order.CustomerID,
      CustomerName,
      OrderNo: order.OrderNo,
      TotalAmount: order.TotalAmount,
      AmountPaid,
      PaymentMethod,
      PaymentDate,
      RemainingBalance: remainingBalance,
      Status: 'Paid', 
    });
    if (latestSummary) {
      await latestSummary.update({
        TotalPaid: totalPaid,
        PaymentDate,
        RemainingBalance: remainingBalance,
        Status: status,
      });
    } else {
      await OrderPaymentsSummary.create({
        OrderID,
        CustomerID: order.CustomerID,
        CustomerName,
        OrderNo: order.OrderNo,
        TotalAmount: order.TotalAmount,
        TotalPaid: totalPaid,
        PaymentDate,
        RemainingBalance: remainingBalance,
        Status: status,
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};


// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  const { PaymentID } = req.params;

  try {
    const payment = await Payment.findByPk(PaymentID);
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found',error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

//Latest Payment
exports.getLatestRemainingBalance = async (req, res) => {
  const { OrderID } = req.params;

  try {
    const latestPayment = await Payment.findOne({
      where: { OrderID },
      order: [['createdAt', 'DESC']],
    });

    if (latestPayment) {
      res.status(200).json({ remainingBalance: latestPayment.RemainingBalance });
    } else {
      res.status(200).json({ remainingBalance: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch remaining balance' });
  }
};


// Update payment
exports.updatePayment = async (req, res) => {
  const { PaymentID } = req.params;
  const { AmountPaid, PaymentDate, RemainingBalance } = req.body;

  try {
    const payment = await Payment.findByPk(PaymentID);

    if (payment) {
      await payment.update({ AmountPaid, PaymentDate, RemainingBalance });
      res.status(200).json(payment);
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

exports.getPaymentByCustomerId = async (req, res) => {
  const { CustomerID } = req.params;

  try {
    const payments = await Payment.findAll({
      where: { CustomerID },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  const { PaymentID } = req.params;

  try {
    const payment = await Payment.findByPk(PaymentID);

    if (payment) {
      await payment.destroy();
      res.status(200).json({ message: 'Payment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};