import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch (error) {
            return res.status(403).json({
                message: "Invalid token.",
                success: false
            });
        }
        next();
    }
    catch (error) {
        console.error("Error authenticating token:", error);
        return res.status(500).json({ message: "Server error." });
    }
};

// Middleware to check if user is student
export const isStudent = (req, res, next) => {
    try {
        if (req.user.accountType !== "student") {
            return res.status(403).json({
                message: "Access denied. You are not a student.",
                success: false
            });
        }

        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Middleware to check if user is instructor
export const isInstructor = (req, res, next) => {
    try {
        if (req.user.accountType !== "instructor") {
            return res.status(403).json({
                message: "Access denied. You are not an instructor.",
                success: false
            });
        }

        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    try {
        if (req.user.accountType !== "admin") {
            return res.status(403).json({
                message: "Access denied. You are not an admin.",
                success: false
            });
        }

        next();
    }
    catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};