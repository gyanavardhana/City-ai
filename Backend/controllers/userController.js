const prisma = require('../db/db'); // Prisma client instance
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require("../logger/logger");

// Generate salt for hashing passwords
const generateSalt = async () => {
    return await bcrypt.genSalt(10);
};

// Hash the password with the salt
const hashPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

// Create a JWT token
const createToken = (userid, secret, expiresIn = "1h") => {
    return jwt.sign({ userid }, secret, { expiresIn });
};

// Signup function to create a new user
const signup = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            logger.error("User already exists");
            return res.status(409).json({ error: "User already exists" });
        }

        const salt = await generateSalt();
        const hashedPassword = await hashPassword(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                salt,
                role: "citizen" // Default role
            }
        });

        logger.info("User Created");
        res.status(201).json({ message: "User Created" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Login function to authenticate the user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            logger.error("No user found");
            return res.status(404).json({ error: "No user found" });
        }

        const hashedPassword = await hashPassword(password, user.salt);
        if (user.password === hashedPassword) {
            const token = createToken(user.id, process.env.JWT_SECRET);
            logger.info("Login successful");
            res.status(200).json({ message: "Login successful", token });
        } else {
            logger.error("Wrong password");
            res.status(401).json({ error: "Wrong password" });
        }
    } catch (err) {
        console.log(err);
        logger.error("Invalid login attempt");
        res.status(401).json({ error: "Invalid login attempt" });
    }
};

// Logout function (token verification not necessarily relevant for logout)
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.error("User not logged in");
            return res.status(401).json({ error: "User not logged in" });
        }

        // Optionally invalidate the token (in a real application, consider maintaining a blacklist or similar)
        logger.info("Logout successful");
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        logger.error("Internal server error");
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get User Profile function
const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.error("User not logged in");
            return res.status(401).json({ error: "User not logged in" });
        }

        // Verify the token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userid;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });

        if (!user) {
            logger.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        logger.info("User profile retrieved");
        res.status(200).json({ user });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update User Profile function
const updateUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.error("User not logged in");
            return res.status(401).json({ error: "User not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userid;

        const { username, email } = req.body;

        // Validate input data (you may add more validation as needed)
        if (!username || !email) {
            logger.error("Missing required fields");
            return res.status(400).json({ error: "Username and email are required" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { username, email }
        });

        logger.info("User profile updated");
        res.status(200).json({ message: "User profile updated", updatedUser });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete User function
const deleteUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            logger.error("User not logged in");
            return res.status(401).json({ error: "User not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userid;

        // Delete the user
        await prisma.user.delete({
            where: { id: userId }
        });

        logger.info("User account deleted");
        res.status(200).json({ message: "User account deleted successfully" });
    } catch (err) {
        logger.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { signup, login, logout, getUserProfile, updateUserProfile, deleteUser };
