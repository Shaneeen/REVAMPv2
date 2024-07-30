module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define("Color", {
      ColorID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ColorName: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      ImageURL: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      tableName: 'colors'
    });
  
    Color.associate = (models) => {
      Color.belongsTo(models.Product, {
        foreignKey: 'ProductID',
        as: 'Product'
      });
    };
  
    return Color;
  };
  