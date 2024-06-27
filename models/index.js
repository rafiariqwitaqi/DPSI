const { Sequelize } = require('sequelize');

// Konfigurasi koneksi Sequelize
// const sequelize = new Sequelize(process.env.DB_URI);

const sequelize = new Sequelize('dpsi', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});


const Customer = require('./customer')(sequelize);
const Category = require('./category')(sequelize);
const Shipper = require('./shipper')(sequelize);
const Employee = require('./employee')(sequelize);
const Supplier = require('./supplier')(sequelize);
const Product = require('./product')(sequelize);
const Order = require('./order')(sequelize);
const OrderDetail = require('./orderDetail')(sequelize);
const User = require('./user')(sequelize);


// Define associations
Product.belongsTo(Supplier, { foreignKey: 'supplierID' });
Product.belongsTo(Category, { foreignKey: 'categoryID' });
Order.belongsTo(Customer, { foreignKey: 'customerID' });
Order.belongsTo(Employee, { foreignKey: 'employeeID' });
Order.belongsTo(Shipper, { foreignKey: 'shipperID' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderID' });
OrderDetail.belongsTo(Product, { foreignKey: 'productID' });



// Sinkronkan model dengan database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });


module.exports = {
    sequelize,
    Customer,
    Employee,
    Product,
    Supplier,
    Category,
    Order,
    OrderDetail,
    Shipper,
    User,
};