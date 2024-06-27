// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const { authenticate } = require('../middleware/auth');
const { Op } = require('sequelize');

// Route to create a new customer
router.post('/', authenticate, async (req, res) => {
    try {
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const customer = await Customer.create({ customerName, contactName, address, city, postalCode, country });
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Route to get all customers
// router.get('/',authenticate , async (req, res) => {
//     try {
//         const customers = await Customer.findAll();
//         if (customers.length === 0) {
//             res.status(404).json({ message: 'Customers not found' });
//         } else {
//             res.json(customers);
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


router.get('/',authenticate, async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const { count, rows: customers } = await Customer.findAndCountAll({
            offset,
            limit,
        });

        if (customers.length === 0) {
            return res.status(404).json({ message: 'Customers not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            customers,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Route to get a customer by ID
router.get('/:id',authenticate , async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a customer by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, contactName, address, city, postalCode, country } = req.body;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        customer.customerName = customerName;
        customer.contactName = contactName;
        customer.address = address;
        customer.city = city;
        customer.postalCode = postalCode;
        customer.country = country;
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a customer by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error('Customer not found');
        await customer.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
