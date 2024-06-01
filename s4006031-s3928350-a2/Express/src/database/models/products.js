module.exports = (sequelize, DataTypes) =>
  sequelize.define("products", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      special_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
