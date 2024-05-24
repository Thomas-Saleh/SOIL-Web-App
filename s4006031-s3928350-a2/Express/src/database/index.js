const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

// Import models
db.user = require('./models/users')(sequelize, DataTypes);
db.isLoggedIn = require('./models/isLoggedIn')(sequelize, DataTypes);
db.product = require('./models/products')(sequelize, DataTypes);
db.review = require('./models/reviews')(sequelize, DataTypes);
db.cart = require('./models/cart')(sequelize, DataTypes);
db.follow = require('./models/follows')(sequelize, DataTypes);

// Set up associations
db.user.hasMany(db.isLoggedIn, { foreignKey: 'user_id' });
db.isLoggedIn.belongsTo(db.user, { foreignKey: 'user_id' });

db.user.hasMany(db.review, { foreignKey: 'user_id' });
db.review.belongsTo(db.user, { foreignKey: 'user_id' });

db.product.hasMany(db.review, { foreignKey: 'product_id' });
db.review.belongsTo(db.product, { foreignKey: 'product_id' });

db.user.hasMany(db.cart, { foreignKey: 'user_id' });
db.cart.belongsTo(db.user, { foreignKey: 'user_id' });

db.product.hasMany(db.cart, { foreignKey: 'product_id' });
db.cart.belongsTo(db.product, { foreignKey: 'product_id' });

db.user.belongsToMany(db.user, { as: 'Followers', through: db.follow, foreignKey: 'follower_id' });
db.user.belongsToMany(db.user, { as: 'Following', through: db.follow, foreignKey: 'following_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
