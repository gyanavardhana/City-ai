const express = require('express');
const router = express.Router();
const { createReview,  getReviewsByLocation, updateReview, deleteReview } = require('../controllers/reviewController');
const authenticate = require('../utils/authMiddleware');


router.post('/reviews', authenticate, createReview);
router.get('/locations/:id/reviews', authenticate, getReviewsByLocation);
router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

module.exports = router;
