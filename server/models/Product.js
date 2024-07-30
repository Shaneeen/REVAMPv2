module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    ProductID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ProductName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    BasePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    Type: {
      type: DataTypes.ENUM('bestseller', 'newest', 'normal'),
      allowNull: false
    }
  }, {
    tableName: 'products'
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.SubCategory, {
      through: 'ProductSubCategory',
      as: 'SubCategories',
      foreignKey: 'ProductID',
      otherKey: 'SubCategoryID'
    });
    Product.hasMany(models.Color, {
      foreignKey: 'ProductID',
      as: 'Colors'
    });
  };

  return Product;
};
