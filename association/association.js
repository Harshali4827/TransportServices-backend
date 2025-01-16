const Order = require("../models/Order");
const OrderPaymentsSummary = require("../models/OrderPaymentSummary");


// Define associations
Order.hasOne(OrderPaymentsSummary, { foreignKey: 'OrderID', as: 'PaymentSummary' });
OrderPaymentsSummary.belongsTo(Order, { foreignKey: 'OrderID', as: 'Order' });
