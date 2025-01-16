const Order = require('../models/Order');
const OrderPaymentsSummary = require('../models/OrderPaymentSummary');

// exports.addOrder = async (req, res) => {
//     const {
//       CustomerID,
//       CustomerName,
//       VehicleID,
//       RegistrationNo,
//       StartDate,
//       EndDate,
//       HoursUsed,
//       DistanceCovered,
//       TotalAmount,
//       Status,
//     } = req.body;
  
//     try {
//       const customerOrdersCount = await Order.count({ where: { CustomerID } });
//       const OrderNo = customerOrdersCount + 1;
//       const order = await Order.create({
//         CustomerID,
//         CustomerName,
//         VehicleID,
//         RegistrationNo,
//         StartDate,
//         EndDate,
//         HoursUsed,
//         DistanceCovered,
//         TotalAmount,
//         Status,
//         OrderNo,
//       });
  
//       res.status(201).json(order);
//     } catch (error) {
//       console.error('Error creating order:', error);
//       res.status(500).json({ error: 'Failed to create order' });
//     }
//   };

exports.addOrder = async (req, res) => {
    const {
      CustomerID,
      CustomerName,
      VehicleID,
      RegistrationNo,
      StartDate,
      EndDate,
      HoursUsed,
      DistanceCovered,
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
        RegistrationNo,
        StartDate,
        EndDate,
        HoursUsed,
        DistanceCovered,
        TotalAmount,
        Status,
        OrderNo,
      });
  
      // Initialize OrderPaymentsSummary with a Pending status
      await OrderPaymentsSummary.create({
        OrderID: order.OrderID,
        CustomerID,
        CustomerName,
        OrderNo,
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
    const { CustomerID, CustomerName, VehicleID, RegistrationNo, StartDate, EndDate, HoursUsed, DistanceCovered, TotalAmount, Status } = req.body;

    try{
        const order = await Order.findByPk(OrderID);
        if(order){
            await order.update({ CustomerID, CustomerName, VehicleID, RegistrationNo, StartDate, EndDate, HoursUsed, DistanceCovered, TotalAmount, Status});
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
exports.getOrdersByCustomer = async (req, res) => {
    const { customerName } = req.params;
    try {
      const orders = await Order.findAll({ where: { CustomerName: customerName } });
      res.status(200).json(orders);
    } catch (error) {
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



  