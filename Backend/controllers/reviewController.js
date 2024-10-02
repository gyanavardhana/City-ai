const prisma = require('../db/db'); // Prisma client instance
const logger = require("../logger/logger");

// Create Review function
const createReview = async (req, res) => {
    try {
        const { locationId, reviewText, rating } = req.body;
        const userId = req.userId; // Extract user ID from the authenticated request

        // Validate input data
        if (!locationId || !reviewText || rating === undefined) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const review = await prisma.review.create({
            data: {
                userId,
                locationId,
                reviewText,
                rating,
            }
        });

        logger.info("Review created");
        res.status(201).json({ message: "Review created", review });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Reviews by Location function
const getReviewsByLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const reviews = await prisma.review.findMany({
            where: { locationId: id }
        });

        if (!reviews.length) {
            logger.warn("No reviews found for this location");
            return res.status(200).json({ reviews });
        }

        logger.info("Reviews retrieved");
        res.status(200).json({ reviews });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Review function
const updateReview = async (req, res) => {
    const { id } = req.params;
    const { reviewText, rating } = req.body;
    const userId = req.userId; // Extract user ID from the authenticated request

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id }
        });

        if (!existingReview || existingReview.userId !== userId) {
            logger.error("Review not found or user not authorized");
            return res.status(403).json({ error: "Unauthorized" });
        }

        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                reviewText,
                rating,
            }
        });

        logger.info("Review updated");
        res.status(200).json({ message: "Review updated", updatedReview });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Review function
const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // Extract user ID from the authenticated request

    try {
        const existingReview = await prisma.review.findUnique({
            where: { id }
        });

        if (!existingReview || existingReview.userId !== userId) {
            logger.error("Review not found or user not authorized");
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.review.delete({
            where: { id }
        });

        logger.info("Review deleted");
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createReview, getReviewsByLocation, updateReview, deleteReview };
