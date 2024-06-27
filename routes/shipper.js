const express = require('express');
const router = express.Router();
const { Shipper } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new shipper
router.post('/', authenticate, async (req, res) => {
    try {
        const { shipperName, phone } = req.body;
        const shipper = await Shipper.create({ shipperName, phone });
        res.status(201).json(shipper);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all shippers
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const shippers = await Shipper.findAll();
//         if (shippers.length === 0) {
//             res.status(404).json({ message: 'Shippers not found' });
//         } else {
//             res.json(shippers);
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

        const { count, rows: shippers } = await Shipper.findAndCountAll({
            offset,
            limit,
        });

        if (shippers.length === 0) {
            return res.status(404).json({ message: 'Shippers not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            shippers,
        };

        res.json(response);
    } catch (error) {
        console.error('Error fetching shippers:', error);
        res.status(500).json({ message: 'Failed to fetch shippers' });
    }
});

// Route to get a shipper by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const shipper = await Shipper.findByPk(id);
        if (!shipper) throw new Error('Shipper not found');
        res.json(shipper);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a shipper by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { shipperName, phone } = req.body;
        const shipper = await Shipper.findByPk(id);
        if (!shipper) throw new Error('Shipper not found');
        shipper.shipperName = shipperName;
        shipper.phone = phone;
        await shipper.save();
        res.json(shipper);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a shipper by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const shipper = await Shipper.findByPk(id);
        if (!shipper) throw new Error('Shipper not found');
        await shipper.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
