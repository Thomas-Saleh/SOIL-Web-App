require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/database'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Simple route to confirm the server is working
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Import and use user routes
require('./src/routes/users.routes')(express, app);
require('./src/routes/isLoggedIn.routes')(express, app);
require('./src/routes/products.routes')(express, app);
require('./src/routes/reviews.routes')(express, app);
require('./src/routes/cart.routes')(express, app);
require('./src/routes/follows.routes')(express, app);

// Database synchronization and server start
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
