module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
        CartItemID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        CartID: {
            type: DataTypes.INTEGER,
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
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'cart_items'
    });

    CartItem.associate = (models) => {
        CartItem.belongsTo(models.Cart, {
            foreignKey: 'CartID',
            as: 'Cart'
        });
        CartItem.belongsTo(models.Product, {
            foreignKey: 'ProductID',
            as: 'Product'
        });
        CartItem.belongsTo(models.Color, {
            foreignKey: 'ColorID',
            as: 'Color'
        });
    };

    return CartItem;
};

