const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('OrderDetail', {
        orderDetailID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        orderID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};
