const {Op} = require('sequelize');
const Order = require('../models/Order');
const OrderPaymentsSummary = require('../models/OrderPaymentSummary');
const Payment = require('../models/Payment');

exports.addOrder = async (req, res) => {
  const {
    CustomerID,
    CustomerName,
    VehicleID,
    VehicleName,
    RegistrationNo,
    UsageType,
    StartDate,
    EndDate,
    HoursUsed,
    HourlyRate,
    TotalTrip,
    TripRate,
    DistanceCovered,
    DistanceRate,
    TotalAmount,
    Status,
  } = req.body;

  try {
    const customerOrdersCount = await Order.count({ where: { CustomerID } });
    const OrderNo = customerOrdersCount + 1;

    const order = await Order.create({
      CustomerID,
      CustomerName,
      VehicleID,
      VehicleName,
      RegistrationNo,
      UsageType,
      StartDate,
      EndDate,
      HoursUsed: UsageType === 'Hourly' ? HoursUsed : null,
      HourlyRate: UsageType === 'Hourly' ? HourlyRate : null,
      TotalTrip: UsageType === 'Trip' ? TotalTrip : null,
      TripRate: UsageType === 'Trip' ? TripRate : null,
      DistanceCovered: UsageType === 'Distance' ? DistanceCovered : null,
      DistanceRate: UsageType === 'Distance' ? DistanceRate : null,
      TotalAmount,
      Status,
      OrderNo,
    });

    await OrderPaymentsSummary.create({
      OrderID: order.OrderID,
      CustomerID,
      CustomerName,
      OrderNo,
      VehicleName,
      RegistrationNo,
      StartDate,
      EndDate,
      TotalAmount,
      TotalPaid: 0,
      RemainingBalance: TotalAmount,
      Status: 'Pending',
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};


exports.getOrders = async (req,res) => {
    try{
        const orders = await Order.findAll();
        res.status(200).json(orders);
    } catch(error){
        res.status(500).json({
            error: 'Failed to fetch orders'
        });
    }
};

exports.getOrderById = async(req,res) => {
    const {OrderID} = req.params;

    try{
        const order = await Order.findByPk(OrderID);
        if(order){
            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found'});
        }
    } catch(error){
        res.status(500).json({error:'Failed to fetch order'});
    }
};

//update order

exports.updateOrder = async (req,res) => {
    const {OrderID} = req.params;
    const { CustomerID, CustomerName, VehicleID,VehicleName, RegistrationNo, StartDate, EndDate, HoursUsed, DistanceCovered, TotalAmount, Status } = req.body;

    try{
        const order = await Order.findByPk(OrderID);
        if(order){
            await order.update({ CustomerID, CustomerName,VehicleID,VehicleName, RegistrationNo, StartDate, EndDate, HoursUsed, DistanceCovered, TotalAmount, Status});
          res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found'});
        }
    }
    catch(error){
        res.status(500).json({ error: 'Failde to update customer'});
    }
}

// Get orders by customer name
// exports.getOrdersByCustomer = async (req, res) => {
//     const { customerName } = req.params;
//     try {
//       const orders = await Order.findAll({ where: { CustomerName: customerName,
//        } });
//       res.status(200).json(orders);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to fetch orders' });
//     }
//   };




// Get orders by customer name
exports.getOrdersByCustomer = async (req, res) => {
  const { customerName } = req.params;

  try {
    const orders = await Order.findAll({
      where: {
        CustomerName: customerName,
      },
      include: [
        {
          model: OrderPaymentsSummary,
          as: 'PaymentSummary',
          required: true,
          where: {
            Status: { [Op.ne]: 'Paid' },
          },
        },
      ],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

//delete customer
exports.deleteOrder = async(req,res) => {
    const {OrderID} = req.params;
    try{
        const order = await Order.findByPk(OrderID);
        if(order){
            await order.destroy();
            res.status(200).json({ message:'Order deleted successfully'});
        } else {
            res.status(404).json({ error:'Order Not found'});
        }
    } catch(error) {
        res.status(500).json({ error: 'Failed to delete order'});
        console.log(error)
    }
}



  