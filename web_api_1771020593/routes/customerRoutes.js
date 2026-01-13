const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyAdmin, customerController.getAllCustomers);
router.get('/:id', verifyToken, customerController.getCustomerById);
router.put('/:id', verifyToken, customerController.updateCustomer);
router.get('/:id/reservations', verifyToken, customerController.getCustomerReservations);

module.exports = router;
