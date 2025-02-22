module.exports = (sequelize, DataTypes) =>
  sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      age: {
        type: DataTypes.INTEGER
      },
      height: {
        type: DataTypes.DECIMAL(5, 2)
      },
      weight: {
        type: DataTypes.DECIMAL(5, 2)
      },
      activity_level: {
        type: DataTypes.ENUM('light', 'moderate', 'active', 'very active')
      },
      dietary_preferences: {
        type: DataTypes.ENUM('vegan', 'vegetarian', 'pescatarian', 'dairy free', 'carnivore diet')
      },
      health_goals: {
        type: DataTypes.ENUM('weight loss', 'muscle gain', 'maintenance', 'sleep 7 to 9 hours', 'eat nutritiously')
      },
      
    }, {
      timestamps: true
    });