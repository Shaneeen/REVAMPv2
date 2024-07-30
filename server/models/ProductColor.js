// server/models/ProductColor.js
module.exports = (sequelize, DataTypes) => {
    const ProductColor = sequelize.define("ProductColor", {
      ProductColorID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ColorID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ImageURL: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'product_colors'
    });
  
    ProductColor.associate = (models) => {
      ProductColor.belongsTo(models.Product, { foreignKey: 'ProductID' });
      ProductColor.belongsTo(models.Color, { foreignKey: 'ColorID' });
    };
  
    return ProductColor;
  };
  