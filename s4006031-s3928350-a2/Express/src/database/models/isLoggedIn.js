module.exports = (sequelize, DataTypes) =>
  sequelize.define("isLoggedIn", {
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
        },
        onDelete: 'CASCADE'
      },
      is_logged_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      login_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      logout_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false
    });