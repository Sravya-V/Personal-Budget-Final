const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  userCreated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  
  date: {
    type: Date,
    default: Date.now
  }
});


expenseSchema.statics.getTotalExpenses = async function (userId) {
  try{
    const expenses = await this.find({ userCreated: userId });
    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    return totalExpenses;
  }catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = mongoose.model('Expense', expenseSchema);