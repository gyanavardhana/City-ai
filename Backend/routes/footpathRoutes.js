const express = require('express');
const router = express.Router();
const {
    createFootpathAssessment,
    getFootpathAssessmentsByLocation,
    updateFootpathAssessment,
    deleteFootpathAssessment
} = require('../controllers/footpathController');
const authenticate = require('../utils/authMiddleware');

router.post('/footpathAssessments', authenticate, createFootpathAssessment);
router.get('/footpathAssessments/location/:locationId', authenticate, getFootpathAssessmentsByLocation);
router.put('/footpathAssessments/:id', authenticate, updateFootpathAssessment);
router.delete('/footpathAssessments/:id', authenticate, deleteFootpathAssessment);

module.exports = router;
