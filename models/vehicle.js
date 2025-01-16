const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Vehicle = sequelize.define('Vehicle', {
  VehicleID: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  VehicleType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  VehicleName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RegistrationNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  UsageType: {
    type: DataTypes.ENUM('Hourly', 'Trip', 'Distance'),
    allowNull: false,
    defaultValue: 'Hourly',
  },
  Capacity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FuelType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Availability: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Vehicle;
