const express = require('express');
const router = express.Router();
const { Order } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new order
router.post('/', authenticate, async (req, res) => {
    try {
        const { customerID, employeeID, orderDate, shipperID } = req.body;
        const order = await Order.create({ customerID, employeeID, orderDate, shipperID });
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error); // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to get all orders
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const orders = await Order.findAll();
//         if (orders.length === 0) {
//             res.status(404).json({ message: 'Orders not found' });
//         } else {
//             res.json(orders);
//         }
//     } catch (error) {
//         console.error('Error fetching orders:', error); // Log the error
//         res.status(500).json({ message: error.message });
//     }
// });

const { Op } = require('sequelize');

router.get('/', authenticate, async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            offset,
            limit,
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Orders not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            orders,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});


// Route to get an order by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) throw new Error('Order not found');
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error); // Log the error
        res.status(500).json({ message: error.message });
    }
});

// Route to update an order by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { customerID, employeeID, orderDate, shipperID } = req.body;
        const order = await Order.findByPk(id);
        if (!order) throw new Error('Order not found');
        order.customerID = customerID;
        order.employeeID = employeeID;
        order.orderDate = orderDate;
        order.shipperID = shipperID;
        await order.save();
        res.json(order);
    } catch (error) {
        console.error('Error updating order:', error); // Log the error
        res.status(400).json({ message: error.message });
    }
});

// Route to delete an order by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findByPk(id);
        if (!order) throw new Error('Order not found');
        await order.destroy();
        res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting order:', error); // Log the error
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
