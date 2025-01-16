
const Vehicle = require('../models/vehicle');

// Add a new vehicle
exports.addVehicle = async (req, res) => {
  const { VehicleType,VehicleName,RegistrationNo,UsageType, Capacity, FuelType, Availability } = req.body;

  try {
    const vehicle = await Vehicle.create({
      VehicleType,
      VehicleName,
      RegistrationNo,
      UsageType,
      Capacity,
      FuelType,
      Availability
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle',error });
  }
};

// Fetch all vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  const { VehicleID } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(VehicleID);
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  const { VehicleID } = req.params;
  const { VehicleType,VehicleName,RegistrationNo,UsageType,Capacity, FuelType, Availability } = req.body;

  try {
    const vehicle = await Vehicle.findByPk(VehicleID);
    if (vehicle) {
      await vehicle.update({ VehicleType,VehicleName,RegistrationNo,UsageType,Capacity, FuelType, Availability });
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle', error });
  }
};



// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  const { VehicleID } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(VehicleID);
    if (vehicle) {
      await vehicle.destroy();
      res.status(200).json({ message: 'Vehicle deleted successfully' });
    } else {
      res.status(404).json({ error: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};