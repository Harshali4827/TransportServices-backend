const express = require('express');
const {
  addExpense,
  getExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

router.post('/expense', addExpense);
router.get('/expense', getExpense);
router.get('/expense/:ExpenseID', getExpenseById);
router.put('/expense/:ExpenseID', updateExpense);
router.delete('/expense/:ExpenseID', deleteExpense);

module.exports = router;
