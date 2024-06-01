module.exports = (sequelize, DataTypes) =>
  sequelize.define("cart", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        }
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {  
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      }
    }, {
      timestamps: true
    });