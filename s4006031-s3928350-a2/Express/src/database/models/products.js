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
      category: {
        type: DataTypes.ENUM('standard', 'special'),
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
