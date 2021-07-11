const express = require('express');
const router = express.Router();


router.use(require('./departmentsRoute'));
router.use(require('./employeeRoute'));
router.use(require('./managersRoute'));


module.exports = router;