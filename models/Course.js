import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String,
        required: true
    },
    studentsEnrolled: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    courseContent: {
        type: Schema.Types.ObjectId,
        ref: "Section"
    },
    ratingAndReviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    price: {
        type: Number,
        required: true
    },
    tag: {
        type: Schema.Types.ObjectId,
        ref: "Tags"
    },
    thumbnail: {
        type: String
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    instructions: {
        type: [String]
    },
    status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    createdAt: {
        type: Date,
        default: Date.now
    }
}); 

const Course = mongoose.model('Course', courseSchema);

export default Course;