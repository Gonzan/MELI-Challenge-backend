var express = require('express');
var router = express.Router();
const apiController = require('../../controllers/api/endpoints');

router.get('/items', apiController.search);
router.get('/items/:id', apiController.items);


module.exports = router;
