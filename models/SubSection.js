import mongoose from 'mongoose';

const subSectionSchema = new Schema({
    title: {
        type: String
    },
    videoUrl: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    }
});

const Section = mongoose.model('Section', subSectionSchema);

export default Section;