const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const { buildSchema } = require('graphql');
const mysql = require('mysql');

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
    imageUrl: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User]
    products: [Product]
  }

  type Mutation {
    blockUser(id: ID!): User
    unblockUser(id: ID!): User
    addProduct(name: String!, price: Float!, special_price: Float, imageUrl: String!): Product
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
      const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      console.log('Adding product:', { name, price, special_price, imageUrl, createdAt, updatedAt });
      db.query(
        'INSERT INTO products (name, price, special_price, imageUrl, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, special_price, imageUrl, createdAt, updatedAt],
        (err, results) => {
          if (err) {
            console.error('Error adding product:', err);
            reject(err);
          }
          console.log('Product added successfully:', results);
          resolve({ id: results.insertId, name, price, special_price, imageUrl, createdAt, updatedAt });
        }
      );
    });
  },
  editProduct: ({ id, name, price, special_price, imageUrl }) => {
    return new Promise((resolve, reject) => {
      const updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
      console.log('Editing product:', { id, name, price, special_price, imageUrl, updatedAt });
      db.query(
        'UPDATE products SET name = ?, price = ?, special_price = ?, imageUrl = ?, updatedAt = ? WHERE id = ?',
        [name, price, special_price, imageUrl, updatedAt, id],
        (err, results) => {
          if (err) {
            console.error('Error editing product:', err);
            reject(err);
          }
          console.log('Product edited successfully:', results);
          resolve({ id, name, price, special_price, imageUrl, updatedAt });
        }
      );
    });
  },
  deleteProduct: ({ id }) => {
    return new Promise((resolve, reject) => {
      console.log('Deleting product:', { id });
      db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
          console.error('Error deleting product:', err);
          reject(err);
        }
        console.log('Product deleted successfully:', results);
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

app.listen(4000, () => {
    console.log('Server running on port 4000');
});
