const express = require('express');
const itemController = require('../controllers/item.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// All item routes require the user to be logged in
router.use(authController.verifySession);

router.post('/', itemController.createItem);
router.get('/', itemController.getItems);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
