import mongoose from "mongoose";

const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    courses: [  
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
        }
    ]
});

const Tags = mongoose.model("Tags", tagSchema);

export default Tags;