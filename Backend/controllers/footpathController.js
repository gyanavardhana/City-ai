const prisma = require('../db/db'); // Prisma client instance
const logger = require("../logger/logger");

// Create Footpath Assessment function
const createFootpathAssessment = async (req, res) => {
    try {
        const { locationId, imageURL, citizenFeedback, aiAssessment } = req.body;

        // Validate input
        if (!locationId) {
            logger.error("Location ID is required");
            return res.status(400).json({ error: "Location ID is required" });
        }

        const footpathAssessment = await prisma.footpathAssessment.create({
            data: {
                locationId,
                imageURL,
                citizenFeedback,
                aiAssessment
            }
        });

        logger.info("Footpath assessment created");
        res.status(201).json({ message: "Footpath assessment created", footpathAssessment });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Footpath Assessments by Location function
const getFootpathAssessmentsByLocation = async (req, res) => {
    const { locationId } = req.params;

    try {
        const assessments = await prisma.footpathAssessment.findMany({
            where: { locationId }
        });

        if (!assessments || assessments.length === 0) {
            logger.error("No assessments found for this location");
            return res.status(404).json({ error: "No assessments found for this location" });
        }

        logger.info("Assessments retrieved");
        res.status(200).json({ assessments });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Footpath Assessment function
const updateFootpathAssessment = async (req, res) => {
    const { id } = req.params;
    const { imageURL, citizenFeedback, aiAssessment } = req.body;

    try {
        const updatedAssessment = await prisma.footpathAssessment.update({
            where: { id },
            data: {
                imageURL,
                citizenFeedback,
                aiAssessment
            }
        });

        logger.info("Footpath assessment updated");
        res.status(200).json({ message: "Footpath assessment updated", updatedAssessment });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Footpath Assessment function
const deleteFootpathAssessment = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.footpathAssessment.delete({
            where: { id }
        });

        logger.info("Footpath assessment deleted");
        res.status(200).json({ message: "Footpath assessment deleted" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createFootpathAssessment,
    getFootpathAssessmentsByLocation,
    updateFootpathAssessment,
    deleteFootpathAssessment
};
