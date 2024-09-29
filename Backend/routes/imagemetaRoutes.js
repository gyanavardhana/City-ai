const express = require('express');
const router = express.Router();
const {
    uploadImageMetadata,
    getImageMetadataByLocation,
    updateImageMetadata,
    deleteImageMetadata
} = require('../controllers/imagemetaController');
const authenticate = require('../utils/authMiddleware'); 


router.post('/image-metadata', authenticate, uploadImageMetadata);
router.get('/image-metadata/:locationId', authenticate, getImageMetadataByLocation);
router.put('/image-metadata/:id', authenticate, updateImageMetadata);
router.delete('/image-metadata/:id', authenticate, deleteImageMetadata);

module.exports = router;