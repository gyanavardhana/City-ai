const express = require('express');
const router = express.Router();
const {
    createFilter,
    getFilters,
    updateFilter,
    deleteFilter
} = require('../controllers/filterController');

const authenticate = require('../utils/authMiddleware');

router.post('/filters', authenticate, createFilter);
router.get('/filters', authenticate, getFilters);
router.put('/filters/:id', authenticate, updateFilter);
router.delete('/filters/:id', authenticate, deleteFilter);

module.exports = router;
