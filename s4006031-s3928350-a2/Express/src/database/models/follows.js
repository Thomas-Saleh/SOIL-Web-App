module.exports = (sequelize, DataTypes) =>
  sequelize.define("follows", {
        follower_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        following_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        }
      }, {
        timestamps: true,
        createdAt: 'created_at'
      });