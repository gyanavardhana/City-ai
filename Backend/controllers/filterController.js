const prisma = require('../db/db'); // Prisma client instance
const logger = require('../logger/logger');

// Create a new Filter
const createFilter = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Check if the name field is provided
        if (!name) {
            logger.error("Filter name is required");
            return res.status(400).json({ error: "Filter name is required" });
        }

        const filter = await prisma.filter.create({
            data: {
                name,
                description: description || null, // Optional description
            }
        });

        logger.info("Filter created successfully");
        res.status(201).json({ message: "Filter created", filter });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all Filters
const getFilters = async (req, res) => {
    try {
        const filters = await prisma.filter.findMany();
        logger.info("Filters retrieved successfully");
        res.status(200).json({ filters });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update an existing Filter
const updateFilter = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        // Check if the filter exists
        const existingFilter = await prisma.filter.findUnique({
            where: { id }
        });

        if (!existingFilter) {
            logger.error("Filter not found");
            return res.status(404).json({ error: "Filter not found" });
        }

        const updatedFilter = await prisma.filter.update({
            where: { id },
            data: {
                name: name || existingFilter.name, // Keep the old name if not provided
                description: description || existingFilter.description // Optional description
            }
        });

        logger.info("Filter updated successfully");
        res.status(200).json({ message: "Filter updated", updatedFilter });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a Filter
const deleteFilter = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the filter exists
        const existingFilter = await prisma.filter.findUnique({
            where: { id }
        });

        if (!existingFilter) {
            logger.error("Filter not found");
            return res.status(404).json({ error: "Filter not found" });
        }

        await prisma.filter.delete({
            where: { id }
        });

        logger.info("Filter deleted successfully");
        res.status(200).json({ message: "Filter deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    createFilter,
    getFilters,
    updateFilter,
    deleteFilter
};
