const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { validate, menuItemSchema } = require('../middleware/validation');

router.get('/', menuItemController.getAllMenuItems);
router.get('/search', menuItemController.searchMenuItems);
router.get('/:id', menuItemController.getMenuItemById);
router.post('/', verifyAdmin, validate(menuItemSchema), menuItemController.createMenuItem);
router.put('/:id', verifyAdmin, validate(menuItemSchema), menuItemController.updateMenuItem);
router.delete('/:id', verifyAdmin, menuItemController.deleteMenuItem);

module.exports = router;
