// routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const { Supplier } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new supplier
router.post('/', authenticate, async (req, res) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const supplier = await Supplier.create({ supplierName, contactName, address, city, postalCode, country, phone });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all suppliers
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const suppliers = await Supplier.findAll();
//         if (suppliers.length === 0) {
//             res.status(404).json({ message: 'Suppliers not found' });
//         } else {
//             res.json(suppliers);
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

router.get('/', authenticate, async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // Default page 1 and limit 10 per page

    // Validate and parse limit to ensure it's a number
    limit = parseInt(limit, 10);

    try {
        const offset = (page - 1) * limit;

        const { count, rows: suppliers } = await Supplier.findAndCountAll({
            offset,
            limit,
        });

        if (suppliers.length === 0) {
            return res.status(404).json({ message: 'Suppliers not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            suppliers,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Failed to fetch suppliers' });
    }
});


// Route to get a supplier by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) throw new Error('Supplier not found');
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a supplier by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) throw new Error('Supplier not found');
        supplier.supplierName = supplierName;
        supplier.contactName = contactName;
        supplier.address = address;
        supplier.city = city;
        supplier.postalCode = postalCode;
        supplier.country = country;
        supplier.phone = phone;
        await supplier.save();
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a supplier by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) throw new Error('Supplier not found');
        await supplier.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
