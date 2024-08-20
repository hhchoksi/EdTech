import mongoose from "mongoose";

const sectionSchema = new Schema({
    sectionId: {
        type: String
    },
    subSection: [
        {
            type: Schema.Types.ObjectId,
            ref: "Subsection",
            required: true
        }
    ]
});

const Section = mongoose.model("Section", sectionSchema);

export default Section;