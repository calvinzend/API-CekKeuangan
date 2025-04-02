import express from 'express';
import { Transaction } from './models/Transaction';
import { Sequelize } from 'sequelize-typescript';
import cors from 'cors';

const config = require("./config/config.json");
    
const sequelize = new Sequelize({
    ...config.development,
    models: [Transaction],
});

const app = express();
app.use(express.json()); 
app.use(cors());

app.post('/transactions', async (req, res) => {
    try {
      const transaction = await Transaction.create(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).json({ msg: "Error creating transaction" });
    }
  });


// Tambahkan setelah membuat app Express
app.use(cors({
  origin: '*', // Ganti dengan port Flutter (biasanya 55000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
  

  app.get('/transactions', async (req, res) => {
    try {
      const transactions = await Transaction.findAll();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ msg : "Error fetching transactions" });
    }
  });

  app.put('/transactions/:id', async (req, res) => {
    try {
      const [updatedCount] = await Transaction.update(req.body, {
        where: { id: req.params.id }
      });
  
      if (updatedCount === 0) {
        return res.status(404).json({ msg: "Transaction not found" });
      }
  
      const updatedTransaction = await Transaction.findByPk(req.params.id);
      res.json(updatedTransaction);
    } catch (error) {
      console.error("Error updating transaction:", error);
      res.status(500).json({ msg: "Error updating transaction" });
    }
  });

  app.get('/transactions/total', async (req, res) => {
    try {
      const income = await Transaction.sum('amount', { where: { type: 'income' } }) || 0;
      const expense = await Transaction.sum('amount', { where: { type: 'expense' } }) || 0;
      const total = income - expense;
  
      res.json({ total, income, expense });
    } catch (error) {
      console.error("Error calculating total:", error);
      res.status(500).json({ msg: "Error calculating total balance" });
    }
  });
  


  app.delete('/transactions/:id', async (req, res) => {
    try {
      const deletedCount = await Transaction.destroy({
        where: { id: req.params.id }
      });
  
      if (deletedCount === 0) {
        return res.status(404).json({ msg: "Transaction not found" });
      }
  
      res.json({ msg: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ msg: "Error deleting transaction" });
    }
  });

  app.listen(3000, async () => {
    try {
        await sequelize.sync();
        console.log('Server is running on port 3000');
    } catch (error) {
        console.error("Failed to sync database:", error);
    }
});
