const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodapp';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/orders', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      address,
      paymentMethod,
      orderNotes,
      items,
      totalPrice,
    } = req.body;

    if (!fullName || !phoneNumber || !address || !items || items.length === 0) {
      return res.status(400).json({
        message: 'Please provide fullName, phoneNumber, address, and at least one item',
      });
    }

    const title = items
      .map((item) => item.title || item.name || 'Food Item')
      .join(', ');

    const newOrder = new Order({
      title,
      fullName,
      phoneNumber,
      address,
      paymentMethod: paymentMethod || 'COD',
      orderNotes: orderNotes || '',
      items,
      totalPrice: totalPrice || 0,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order saved successfully',
      orderId: savedOrder._id,
      order: savedOrder,
    });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({
      message: 'Failed to save order',
      error: error.message,
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
