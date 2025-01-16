const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const { v4: uuidv4 } = require('uuid');

const Payment = sequelize.define('Payment', {
  PaymentID: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  OrderID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Order,
      key: 'OrderID',      
    },
  },
  CustomerID:{
    type:DataTypes.UUID,
    allowNull:false,
  },
  CustomerName:{
    type: DataTypes.STRING,
    allowNull:false,
 },
 OrderNo:{
  type: DataTypes.INTEGER,
  allowNull: false,
 },
 TotalAmount: {
  type: DataTypes.FLOAT,
  allowNull: false,
},
AmountPaid: {
    type: DataTypes.FLOAT,
    allowNull: false,
},
PaymentMethod: {
  type: DataTypes.STRING,
  allowNull: false,
},
  PaymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  RemainingBalance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue:'Paid',
    allowNull:false,
  }
});
Payment.belongsTo(Order, { foreignKey: 'OrderID', as: 'Order' });

module.exports = Payment;
