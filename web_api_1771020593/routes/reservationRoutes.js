const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validate, reservationSchema, addItemSchema, confirmReservationSchema, paymentSchema } = require('../middleware/validation');

router.post('/', verifyToken, validate(reservationSchema), reservationController.createReservation);
router.get('/:id', verifyToken, reservationController.getReservationById);
router.post('/:id/items', verifyToken, validate(addItemSchema), reservationController.addItemToReservation);
router.put('/:id/confirm', verifyAdmin, validate(confirmReservationSchema), reservationController.confirmReservation);
router.post('/:id/pay', verifyToken, validate(paymentSchema), reservationController.payReservation);
router.delete('/:id', verifyToken, reservationController.cancelReservation);

module.exports = router;
