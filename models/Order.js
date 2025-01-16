const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Customer = require('./Customer'); 
const Vehicle = require('./vehicle');

const Order = sequelize.define('Order', {
  OrderID: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  CustomerID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: 'CustomerID',
    },
  },
  CustomerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VehicleID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'VehicleID',
    },
  },
  VehicleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RegistrationNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UsageType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  HoursUsed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  HourlyRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  TotalTrip: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  TripRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  DistanceCovered: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  DistanceRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  TotalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  OrderNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Order.belongsTo(Customer, { foreignKey: 'CustomerID', as: 'Customer' });
Order.belongsTo(Vehicle, { foreignKey: 'VehicleID', as: 'Vehicle' });

module.exports = Order;
