const express = require('express');
const router = express.Router();
const { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation } = require('../controllers/locationController');
const authenticate  = require('../utils/authMiddleware'); // Import the auth middleware

// Routes with authentication middleware
router.post('/locations', authenticate, createLocation);  // Create location
router.get('/locations', authenticate, getAllLocations);  // Get all locations
router.get('/locations/:id', authenticate, getLocationById);  // Get location by ID
router.put('/locations/:id', authenticate, updateLocation);  // Update location
router.delete('/locations/:id', authenticate, deleteLocation);  // Delete location

module.exports = router;
