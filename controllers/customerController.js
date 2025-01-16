const Customer = require('../models/Customer');

// Add a new customer
exports.addCustomer = async (req, res) => {
  const { Name, Email, Contact, Address } = req.body;

  try {
    const customer = await Customer.create({ Name, Email, Contact, Address });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer',error });
  }
};

// Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    ({
      order: [['createdAt', 'ASC']], 
    })
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  const { CustomerID } = req.params;

  try {
    const customer = await Customer.findByPk(CustomerID);
    if (customer) {
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  const { CustomerID } = req.params;
  const { Name, Email, Contact, Address } = req.body;

  try {
    const customer = await Customer.findByPk(CustomerID);
    if (customer) {
      await customer.update({ Name, Email, Contact, Address });
      res.status(200).json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer',error });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  const { CustomerID } = req.params;

  try {
    const customer = await Customer.findByPk(CustomerID);
    if (customer) {
      await customer.destroy();
      res.status(200).json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer', error });
  }
};
