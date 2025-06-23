import Course from '../models/Course.js';
import Tags from '../models/Tags.js';
import User from '../models/User.js';
import uploadImageToCloudinary from '../utils/imageUploader.js';

export const createCourse = async (req, res) => {
    try {
        const { title, description, tag, price, whatYouWillLearn } = req.body;
        const thumbnail = req.files.thumbnail;

        if (!title || !description || !tag || !price || !whatYouWillLearn) {
            return res.status(400).json({
                message: "Please enter all fields",
                success: false
            });
        }

        if (!thumbnail) {
            return res.status(400).json({
                message: "Thumbnail is required",
                success: false
            });
        }

        // Instructor  check
        const instructorDetails = await User.findById(req.user._id);

        if (!instructor) {
            return res.status(404).json({
                message: "Instructor not found",
                success: false
            });
        }

        // Validate tags
        const tagDetails = await Tags.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
                message: "Tags not found",
                success: false
            });
        }

        // Upload thumbnail to Cloudinary
        const uploadedThumbnail = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME, 300, 80);

        // Create course
        const newCourse = await Course.create({
            title,
            description,
            whatYouWillLearn,
            instructor: instructorDetails._id,
            tag: tagDetails._id,
            price,
            thumbnail: uploadedThumbnail.secure_url,
            createdBy: req.user._id
        });

        // Update instructor's courses
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        // Update tags with the new course
        await Tags.findByIdAndUpdate(
            tagDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        return res.status(201).json({
            message: "Course created successfully",
            success: true,
            data: newCourse
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Course creation error",
            success: false
        });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, {
            title: true,
            description: true,
            whatYouWillLearn: true,
            price: true,
            thumbnail: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
            instructor: true,
            tag: true
        }).populate("instructor").exec();

        return res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            data: courses
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching courses",
            success: false
        });
    }
};