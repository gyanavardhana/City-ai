const prisma = require('../db/db'); // Prisma client instance
const logger = require("../logger/logger");

// Upload Image Metadata function
const uploadImageMetadata = async (req, res) => {
    try {
        const { locationId, imageURL, description, labels } = req.body;

        // Validate input data
        if (!locationId || !imageURL) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "locationId and imageURL are required" });
        }

        // Create Image Metadata entry
        const imageMetadata = await prisma.imageMetadata.create({
            data: {
                locationId,
                imageURL,
                description: description || null,
                labels: labels || [],
            }
        });

        logger.info("Image metadata uploaded");
        res.status(201).json({ message: "Image metadata uploaded", imageMetadata });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Image Metadata by Location function
const getImageMetadataByLocation = async (req, res) => {
    const { locationId } = req.params;
    try {
        const imageMetadata = await prisma.imageMetadata.findMany({
            where: { locationId }
        });

        if (!imageMetadata.length) {
            logger.error("No image metadata found for this location");
            return res.status(404).json({ error: "No image metadata found for this location" });
        }

        logger.info("Image metadata retrieved");
        res.status(200).json({ imageMetadata });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Image Metadata function
const updateImageMetadata = async (req, res) => {
    const { id } = req.params;
    try {
        const { imageURL, description, labels } = req.body;

        // Validate input data
        if (!imageURL) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "imageURL is required" });
        }

        // Update Image Metadata entry
        const updatedImageMetadata = await prisma.imageMetadata.update({
            where: { id },
            data: {
                imageURL,
                description: description || null,
                labels: labels || [],
            }
        });

        logger.info("Image metadata updated");
        res.status(200).json({ message: "Image metadata updated", updatedImageMetadata });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Image Metadata function
const deleteImageMetadata = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.imageMetadata.delete({
            where: { id }
        });

        logger.info("Image metadata deleted");
        res.status(200).json({ message: "Image metadata deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    uploadImageMetadata,
    getImageMetadataByLocation,
    updateImageMetadata,
    deleteImageMetadata
};
