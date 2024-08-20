import mongoose from "mongoose";

const ratingAndReviewsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
});

const RatingAndReviews = mongoose.model('RatingAndReviews', ratingAndReviewsSchema);

export default RatingAndReviews;