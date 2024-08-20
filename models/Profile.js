import mongoose from 'mongoose';

const profileSchema = new Schema({
    gender: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    }
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;