module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        CartID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        SessionID: {
            type: DataTypes.STRING,
            allowNull: true
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'carts'
    });

    Cart.associate = (models) => {
        Cart.hasMany(models.CartItem, {
            foreignKey: 'CartID',
            as: 'Items'
        });
    };

    return Cart;
};

  