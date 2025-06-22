import Tags from '../models/Tags';

export const createTag = async (req, res) => {
    try {
        const { name, description } = req.body;

        if(!name || !description) {
            return res.status(400).json({ 
                message: "Please enter all fields",
                success: false 
            });
        }

        const tagDetails = await Tags.create({
            name: name,
            description: description
        });

        return res.status(201).json({
            message: "Tag created successfully",
            success: true,
            data: tagDetails
        });
    } 
    catch (error) {
        return res.status(500).json({ 
            message: "Tag creation error",
            success: false 
        });
    }
};

export const getAllTags = async (req, res) => {
    try {
        const tags = await Tags.find({}, {name: true, description: true});
        
        return res.status(200).json({
            message: "Tags retrieved successfully",
            success: true,
            data: tags
        });
    } 
    catch (error) {
        return res.status(500).json({ 
            message: "Tag retrieval error",
            success: false 
        });
    }
};