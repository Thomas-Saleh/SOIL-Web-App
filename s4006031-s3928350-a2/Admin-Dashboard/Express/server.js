const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');
const mysql = require('mysql');

// Configuration values directly in the code
const DB_HOST = 'rmit.australiaeast.cloudapp.azure.com';
const DB_USER = 's4006031_fsd_a2';
const DB_PASS = 'p20040715!';
const DB_NAME = 's4006031_fsd_a2';
const PORT = 4000;

const app = express(); // Initialize Express app

// Use CORS middleware
app.use(cors());

// Define your GraphQL schema
const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    age: Int
    height: Float
    weight: Float
    activity_level: String
    dietary_preferences: String
    health_goals: String
    isBlocked: Boolean!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    special_price: Float
    imageUrl: String
  }

  type Query {
    users: [User]
    products: [Product]
  }

  type Mutation {
    blockUser(id: ID!): User
    unblockUser(id: ID!): User
    addProduct(name: String!, price: Float!, special_price: Float, imageUrl: String): Product
    editProduct(id: ID!, name: String, price: Float, special_price: Float, imageUrl: String): Product
    deleteProduct(id: ID!): Product
  }
`);

// Create MySQL connection
let db = mysql.createConnection({
    host: 'rmit.australiaeast.cloudapp.azure.com',
    user: 's4006031_fsd_a2',
    password: 'p20040715!',
    database: 's4006031_fsd_a2',
  });

function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
    } else {
      console.log('MySQL connected...');
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Define resolvers
const root = {
  users: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  products: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products', (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  blockUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET isBlocked = true WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve({ id });
      });
    });
  },
  unblockUser: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET isBlocked = false WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve({ id });
      });
    });
  },
  addProduct: ({ name, price, special_price, imageUrl }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO products (name, price, special_price, imageUrl) VALUES (?, ?, ?, ?)',
        [name, price, special_price, imageUrl],
        (err, results) => {
          if (err) reject(err);
          resolve({ id: results.insertId, name, price, special_price, imageUrl });
        }
      );
    });
  },
  editProduct: ({ id, name, price, special_price, imageUrl }) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE products SET name = ?, price = ?, special_price = ?, imageUrl = ? WHERE id = ?',
        [name, price, special_price, imageUrl, id],
        (err, results) => {
          if (err) reject(err);
          resolve({ id, name, price, special_price, imageUrl });
        }
      );
    });
  },
  deleteProduct: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve({ id });
      });
    });
  },
};

// Set up GraphQL endpoint
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


  
