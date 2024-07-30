module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define("SubCategory", {
    SubCategoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    SubCategoryName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'subcategories'
  });

  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, {
      foreignKey: 'CategoryID',
      as: 'Category'
    });
    SubCategory.belongsToMany(models.Product, {
      through: 'ProductSubCategory',
      as: 'Products',
      foreignKey: 'SubCategoryID',
      otherKey: 'ProductID'
    });
  };

  return SubCategory;
};
