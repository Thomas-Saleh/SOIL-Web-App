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
      description: {
        type: DataTypes.TEXT
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('standard', 'special'),
        allowNull: false
      },
      specialPrice: {
        type: DataTypes.DECIMAL(10, 2)
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: true
    });
