import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Registration handler
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Basic validation for missing fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // Password strength check
        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long.",
                success: false,
            });
        }

        const file = req.file;
        let profilePhoto = null;

        // If file is provided, upload to Cloudinary
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhoto = cloudResponse.secure_url;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: { profilePhoto },
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Profile update handler
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let resume = null;

        // Validate bio length
        if (bio && bio.length > 500) {
            return res.status(400).json({
                message: "Bio cannot exceed 500 characters.",
                success: false,
            });
        }

        // Validate skills format
        if (skills && !Array.isArray(skills)) {
            return res.status(400).json({
                message: "Skills must be an array.",
                success: false,
            });
        }

        // Upload resume if provided
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            resume = {
                url: cloudResponse.secure_url,
                originalName: file.originalname,
            };
        }

        const userId = req.id; // ID from authentication middleware
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }

        // Update user profile fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        if (resume) {
            user.profile.resume = resume.url;
            user.profile.resumeOriginalName = resume.originalName;
        }

        // Optionally update the profile photo if provided
        if (file && !resume) { // Check if photo is uploaded without a resume
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Login handler
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check user role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: `Welcome back, ${user.fullname}`,
                success: true,
                user,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error.", success: false });
    }
};

// Logout handler
export const logout = (req, res) => {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
        message: "Logged out successfully.",
        success: true,
    });
};
