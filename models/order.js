const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Order', {
        orderID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customerID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        shipperID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};
