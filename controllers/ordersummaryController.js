
const OrderPaymentsSummary = require('../models/OrderPaymentSummary');
// Get all order payment summaries

exports.getAllOrderPaymentsSummaries = async (req, res) => {
    try {
      const summaries = await OrderPaymentsSummary.findAll();
      res.status(200).json(summaries);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      res.status(500).json({ error: 'Failed to fetch order payment summaries',error });
    }
  };
  
  // delete Order Summary 
  
  exports.deleteOrderPaymentSummary = async (req, res) => {
    const { OrderID } = req.params;
  
    try {
      const summary = await OrderPaymentsSummary.findOne({ where: { OrderID } });
      if (!summary) {
        return res.status(404).json({ error: 'Order payment summary not found' });
      }
  
      await summary.destroy();
      res.status(200).json({ message: 'Order payment summary deleted successfully' });
    } catch (error) {
      console.error('Error deleting order payment summary:', error);
      res.status(500).json({ error: 'Failed to delete order payment summary' });
    }
  };
  

  exports.getPaymentByCustomerId = async (req, res) => {
    const { CustomerID } = req.params;
  
    try {
      const payments = await OrderPaymentsSummary.findAll({
        where: { CustomerID },
        order: [['createdAt', 'DESC']],
      });
      res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Failed to fetch payments' });
    }
  };



  
  


 