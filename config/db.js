const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('vehicle_management', 'root', '12345', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log('Error: ' + err));

module.exports = sequelize;
