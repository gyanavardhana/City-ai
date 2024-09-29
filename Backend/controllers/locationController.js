const prisma = require('../db/db'); // Prisma client instance
const logger = require("../logger/logger");

// Create Location function
const createLocation = async (req, res) => {
    try {
        const { name, latitude, longitude, type, pollution, safety, touristAttraction, crimeRate, costOfLiving } = req.body;

        // Validate input data
        if (!name || latitude === undefined || longitude === undefined || !type || crimeRate === undefined || !costOfLiving) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const location = await prisma.location.create({
            data: {
                name,
                latitude,
                longitude,
                type,
                pollution,
                safety,
                touristAttraction: touristAttraction || false, // Default to false
                crimeRate,
                costOfLiving // Expecting this to be in the format of the enum
            }
        });

        logger.info("Location created");
        res.status(201).json({ message: "Location created", location });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get All Locations function
const getAllLocations = async (req, res) => {
    try {
        const locations = await prisma.location.findMany();
        logger.info("Locations retrieved");
        res.status(200).json({ locations });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Location by ID function
const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const location = await prisma.location.findUnique({
            where: { id }
        });

        if (!location) {
            logger.error("Location not found");
            return res.status(404).json({ error: "Location not found" });
        }

        logger.info("Location retrieved");
        res.status(200).json({ location });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Location function
const updateLocation = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, latitude, longitude, type, pollution, safety, touristAttraction, crimeRate, costOfLiving } = req.body;

        // Validate input data
        if (!name || latitude === undefined || longitude === undefined || !type || crimeRate === undefined || !costOfLiving) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const updatedLocation = await prisma.location.update({
            where: { id },
            data: {
                name,
                latitude,
                longitude,
                type,
                pollution,
                safety,
                touristAttraction: touristAttraction || false, // Default to false
                crimeRate,
                costOfLiving // Expecting this to be in the format of the enum
            }
        });

        logger.info("Location updated");
        res.status(200).json({ message: "Location updated", updatedLocation });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Location function
const deleteLocation = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.location.delete({
            where: { id }
        });

        logger.info("Location deleted");
        res.status(200).json({ message: "Location deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { createLocation, getAllLocations, getLocationById, updateLocation, deleteLocation };
