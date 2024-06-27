const express = require('express');
const router = express.Router();
const { OrderDetail } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new order detail
// Route to create a new order detail
router.post('/', authenticate, async (req, res) => {
    try {
        const { orderID, productID, quantity } = req.body;
        const orderDetail = await OrderDetail.create({ orderID, productID, quantity });

        res.status(201).json(orderDetail);
    } catch (error) {
        console.error('Error creating order detail:', error);

        if (error.name === 'SequelizeValidationError') {
            // Format Sequelize validation error messages
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));

            res.status(400).json({ message: 'Validation error', errors: validationErrors });
        } else {
            res.status(500).json({ message: 'Failed to create order detail' });
        }
    }
});


// Route to get all order details
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const orderDetails = await OrderDetail.findAll();
//         if (orderDetails.length === 0) {
//             res.status(404).json({ message: 'Order details not found' });
//         } else {
//             res.json(orderDetails);
//         }
//     } catch (error) {
//         console.error('Error fetching order details:', error);
//         res.status(500).json({ message: 'Failed to fetch order details' });
//     }
// });

const { Op } = require('sequelize');

router.get('/', authenticate, async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const { count, rows: orderDetails } = await OrderDetail.findAndCountAll({
            offset,
            limit,
        });

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Order details not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            orderDetails,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Failed to fetch order details' });
    }
});


// Route to get order detail by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const orderDetail = await OrderDetail.findByPk(id);
        if (!orderDetail) {
            res.status(404).json({ message: 'Order detail not found' });
        } else {
            res.json(orderDetail);
        }
    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({ message: 'Failed to fetch order detail' });
    }
});

// Route to update order detail by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { orderID, productID, quantity } = req.body;
        const orderDetail = await OrderDetail.findByPk(id);
        if (!orderDetail) {
            res.status(404).json({ message: 'Order detail not found' });
        } else {
            orderDetail.orderID = orderID;
            orderDetail.productID = productID;
            orderDetail.quantity = quantity;
            await orderDetail.save();
            res.json(orderDetail);
        }
    } catch (error) {
        console.error('Error updating order detail:', error);
        res.status(400).json({ message: error.message });
    }
});

// Route to delete order detail by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const orderDetail = await OrderDetail.findByPk(id);
        if (!orderDetail) {
            res.status(404).json({ message: 'Order detail not found' });
        } else {
            await orderDetail.destroy();
            res.sendStatus(204);
        }
    } catch (error) {
        console.error('Error deleting order detail:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
