const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { verifyAdmin } = require('../middleware/auth');
const { validate, tableSchema } = require('../middleware/validation');

router.get('/', tableController.getAllTables);
router.post('/', verifyAdmin, validate(tableSchema), tableController.createTable);
router.put('/:id', verifyAdmin, validate(tableSchema), tableController.updateTable);
router.delete('/:id', verifyAdmin, tableController.deleteTable);

module.exports = router;
