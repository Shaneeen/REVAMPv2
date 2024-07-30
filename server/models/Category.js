module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    CategoryID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    CategoryName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ImageURL: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categories'
  });

  Category.associate = (models) => {
    Category.hasMany(models.SubCategory, {
      foreignKey: 'CategoryID',
      as: 'SubCategories'
    });
  };

  return Category;
};
