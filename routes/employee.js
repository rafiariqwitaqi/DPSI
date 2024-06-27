const express = require('express');
const router = express.Router();
const { Employee } = require('../models');
const { authenticate } = require('../middleware/auth');

// Route to create a new employee
router.post('/', authenticate, async (req, res) => {
    try {
        const { lastName, firstName, birthDate, photo, notes } = req.body;
        const employee = await Employee.create({ lastName, firstName, birthDate, photo, notes });
        res.status(201).json(employee);
    } catch (error) {
        console.error('Error creating employee:', error); // Log the error
        if (error.name === 'SequelizeValidationError') {
            res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});


// Route to get all employees
// router.get('/', authenticate, async (req, res) => {
//     try {
//         const employees = await Employee.findAll();
//         if (employees.length === 0) {
//             res.status(404).json({ message: 'Employees not found' });
//         } else {
//             res.json(employees);
//         }
//     } catch (error) {
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

        const { count, rows: employees } = await Employee.findAndCountAll({
            offset,
            limit,
        });

        if (employees.length === 0) {
            return res.status(404).json({ message: 'Employees not found' });
        }

        const totalPages = Math.ceil(count / limit);

        const response = {
            totalCount: count,
            totalPages,
            currentPage: page,
            employees,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Route to get an employee by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('Employee not found');
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update an employee by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { lastName, firstName, birthDate, photo, notes } = req.body;
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('Employee not found');
        employee.lastName = lastName;
        employee.firstName = firstName;
        employee.birthDate = birthDate;
        employee.photo = photo;
        employee.notes = notes;
        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete an employee by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);
        if (!employee) throw new Error('Employee not found');
        await employee.destroy();
        res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
