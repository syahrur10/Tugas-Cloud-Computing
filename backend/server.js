const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Inisialisasi data
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ orders: [] }, null, 2));
}

// GET semua order
app.get('/api/orders', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.orders);
});

// POST order baru
app.post('/api/orders', (req, res) => {
  const { customer, serviceType, weight } = req.body;
  
  if (!customer || !serviceType || !weight || weight <= 0) {
    return res.status(400).json({ error: 'Data tidak lengkap' });
  }

  const pricePerKg = serviceType === 'Express' ? 15000 : 10000;
  const total = pricePerKg * weight;
  
  const newOrder = {
    id: Date.now(),
    customer,
    serviceType,
    weight: parseFloat(weight),
    total,
    status: 'Diproses',
    createdAt: new Date().toLocaleString()
  };
  
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.orders.push(newOrder);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  
  res.status(201).json(newOrder);
});

// DELETE order
app.delete('/api/orders/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.orders = data.orders.filter(order => order.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ message: 'Order dihapus' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend laundry berjalan di port ${PORT}`);
});