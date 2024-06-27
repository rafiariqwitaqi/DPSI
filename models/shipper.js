const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Shipper', {
        shipperID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        shipperName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
};
