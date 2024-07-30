//this shit is to join the tables or smtg
module.exports = (sequelize, DataTypes) => {
    const ProductSubCategory = sequelize.define("ProductSubCategory", {
      ProductID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SubCategoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      }
    }, {
      tableName: 'product_subcategories'
    });
  
    return ProductSubCategory;
  };
  