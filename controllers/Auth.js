import User from '../models/User';
import OTP from '../models/OTP';
import Profile from '../models/Profile';
import otpGenerator from 'otp-generator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Otp Sender 
export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const isUser = await User.findOne({ email });

        if(isUser) {
            return res.status(401).json({
                message: 'User already exists',
                success: false
            });
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets : false,
            specialChars: false
        });
        console.log(otp);

        let result = await otp.findOne({ otp });

        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets : false,
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
export const signUp = async(req, res) => {
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

        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                message: 'Please fill all the fields',
                success: false
            });
        }

        if(password!== confirmPassword) {
            return res.status(403).json({
                message: 'Passwords do not match',
                success: false
            });
        }

        const isUser = await User.findOne({ email });

        if(isUser) {
            return res.status(401).json({
                message: 'User already exists',
                success: false
            });
        }

        const recentOtp = await User.findOne({email}).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        if(!recentOtp) {
            return res.status(401).json({
                message: 'OTP not found',
                success: false
            });
        }

        else if(recentOtp.otp!== otp) {
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