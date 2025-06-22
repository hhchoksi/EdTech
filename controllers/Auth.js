import User from '../models/User';
import OTP from '../models/OTP';
import Profile from '../models/Profile';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailSender from '../utils/mailSender';

// Otp Sender 
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const isUser = await User.findOne({ email });

        if (isUser) {
            return res.status(401).json({
                message: 'User already exists',
                success: false
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log(otp);

        let result = await otp.findOne({ otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            result = await otp.findOne({ otp });
        }

        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            message: 'OTP sent successfully',
            success: true
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

//Sign up
export const signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                message: 'Please fill all the fields',
                success: false
            });
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                message: 'Passwords do not match',
                success: false
            });
        }

        const isUser = await User.findOne({ email });

        if (isUser) {
            return res.status(401).json({
                message: 'User already exists',
                success: false
            });
        }

        const recentOtp = await User.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        if (!recentOtp) {
            return res.status(401).json({
                message: 'OTP not found',
                success: false
            });
        }

        else if (recentOtp.otp !== otp) {
            return res.status(401).json({
                message: 'Invalid OTP',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profilePayload = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const userPayload = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails,
            image: `https://api.dicebear.com/9.x/initials/svg/${firstName} ${lastName}`,
        });

        return res.status(201).json({
            message: 'User created successfully',
            success: true
        });
    }
    catch (error) {
        console.log("Error signing up:", error);
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                message: 'Please enter required credentials',
                success: false
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid credentials',
                success: false
            });
        }

        const token = jwt.sign(
            { email: user.email, id: user._id, accountType: user.accountType },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + (60 * 60 * 24 * 1000)),
            httpOnly: true
        }

        res.cookie('token', token, options).status(200).json({
            message: 'Logged in successfully',
            success: true,
            user
        });

    }
    catch (error) {
        console.log('Error logging in:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const user = await User.findbyId(req.user.id);

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false
            });
        }

        if (confirmPassword !== newPassword) {
            return res.status(403).json({
                message: 'Passwords do not match',
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid old password',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findbyIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true });

        try {
            const response = await mailSender(updatedUser.email, "Password Change", `Your password has been changed successfully for ${updatedUser.firstName} ${updatedUser.lastName}`);
        }
        catch (error) {
            console.log(error);
            console.log('Failed to send password change email');
            return res.status(500).json({
                message: 'Failed to send password change email',
                success: false
            });
        }

        return res.status(200).json({
            message: 'Password changed successfully',
            success: true
        });
    }
    catch (error) {
        console.log('Error changing password:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false
        });
    }
};