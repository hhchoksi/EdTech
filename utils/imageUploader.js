import { v2 as cloudinary } from 'cloudinary';

const uploadImageToCloudinary = async (file,  folder, height, quality) => {
    try {
        const options = {
            folder: folder
        };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = 'auto'; // Automatically determine resource type (image or video)

        return await cloudinary.uploader.upload(file.tempFilePath, options);

        
    } catch (error) {
        console.error(`Error uploading image to Cloudinary: ${error.message}`);
        throw new Error('Failed to upload image');
    }
}

export default uploadImageToCloudinary;