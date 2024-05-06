const {Router}=require('express')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User=require('./models/user')
const BudgetTable=require('./models/Budget')
const ExpenseTable=require('./models/Expense')
const router=Router()


//middleware
const jwtCheck = (req, res, next) => {
  const token = req.headers['x-access-token']|| req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secret');     
    const user = User.findOne({ _id: decoded.userId });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.user = decoded;
    req.userName=user.name;
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};



//budgets
router.post('/budgets',jwtCheck, async (req, res) => {
    try {
      const { title, amount} = req.body;
      
      const newBudget = new BudgetTable({
        title,
        amount,
        userCreated: req.user.userId, 
      });
  
      const savedBudget = await newBudget.save();
  
      res.status(201).json(savedBudget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  router.get('/budgets',jwtCheck, async (req, res) => {
    try {
      const budgets = await BudgetTable.find({ userCreated: req.user.userId });
      res.json(budgets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.put('/budgets/:id',jwtCheck, async (req, res) => {
    try {
      const { title, amount } = req.body;
  
      const updatedBudget = await BudgetTable.findByIdAndUpdate(
        req.params.id,
        {
          title,
          amount,
        },
        { new: true }
      );
  
      if (!updatedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
  
      res.json(updatedBudget);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
 
  router.delete('/budgets/:id',jwtCheck, async (req, res) => {
    try {
      const deletedBudget = await BudgetTable.findByIdAndDelete(req.params.id);
  
      if (!deletedBudget) {
        return res.status(404).json({ message: 'Budget not found' });
      }
  
      res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });




//expenses
router.post('/expenses',jwtCheck,  async (req, res) => {
    try {
      const { amount, comment, category } = req.body;
  
      const newExpense = new ExpenseTable({
        amount,
        comment,
        userCreated: req.user.userId,
        category,
      });
  
      const savedExpense = await newExpense.save();
  
      res.status(201).json(savedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
 
  router.get('/expenses',jwtCheck, async (req, res) => {
    try {
      const expenses = await ExpenseTable.find({ userCreated: req.user.userId })
      res.json(expenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  router.put('/expenses/:id',jwtCheck, async (req, res) => {
    try {
      const { amount, comment, category } = req.body;
  
      const updatedExpense = await ExpenseTable.findByIdAndUpdate(
        req.params.id,
        {
          amount,
          comment,
          category
        },
        { new: true }
      );
  
      if (!updatedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.json(updatedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.delete('/expenses/:id',jwtCheck, async (req, res) => {
    try {
      const deletedExpense = await ExpenseTable.findByIdAndDelete(req.params.id);
  
      if (!deletedExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }
  
      res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  //Total Budget for a User
  router.get('/budgets/total',jwtCheck, async (req, res) => {
    try {
      const totalBudget = await BudgetTable.getTotalBudget(req.user.userId);
      res.json({ totalBudget });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //Total Expenses for a user
router.get('/expenses/total',jwtCheck, async (req, res) => {
  try {
    const totalExpenses = await ExpenseTable.getTotalExpenses(req.user.userId);
    res.json({ totalExpenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get Monthly Expenses for a user
router.get('/expenses/monthly',jwtCheck, async (req, res) => {
  try {
    const totalExpensesByMonth = {};
    const allExpenses = await ExpenseTable.find({ userCreated: req.user.userId});

    allExpenses.forEach((expense) => {
      const monthYear = expense.date.toISOString().slice(0, 7);
      if (!totalExpensesByMonth[monthYear]) {
        totalExpensesByMonth[monthYear] = 0;
      }
      totalExpensesByMonth[monthYear] += expense.amount;
    });

    res.json(totalExpensesByMonth);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// authorization
router.post('/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/refresh-token', async (req, res) => {
    try {
      const token = req.body.token;
      const email = req.body.email;
      const user = await User.findOne({ email });
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      jwt.verify(token, 'secret', (err) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1m' });
        res.json({ token });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.post('/logout', async(req,res)=>{
   res.send({
        message:"success"
   });
});


module.exports = jwtCheck;
module.exports=router