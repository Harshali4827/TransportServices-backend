const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const{ v4: uuidv4} = require('uuid');

const Customer = sequelize.define('Customer', {
    CustomerID : {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true,
        },
    },
    Contact:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Address:{
        type: DataTypes.STRING,
        allowNull: true,
    },
});
module.exports = Customer;