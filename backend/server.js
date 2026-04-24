const express = require('express');
const cors = require('cors');
const path = require('path');
const fncRoutes = require('./routes/fncRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api/fnc', fncRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur actif sur http://localhost:${PORT}`);
});
