const mongoose = require('mongoose');
const uploadSchema = new mongoose.Schema({
    photoPath: {
        type: String,
        required: true
    },
    // fileName: {
    //     type: String
    // },
    predictedAnimal: {
        type: String,
        required: true
    },

    uploadDate: {
        type: Date,
        default: Date.now
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    imageInfo: {
        size: {
            type: Number,
            required: true
        },
        mimetype: {
            type: String,
            required: true
        }
    },

    mapLink: {
        type: String
    },

    dateTaken: {
        type: Date
    },

    locationTaken: {
        type: String
    },

    photographer: {
        type: String
    },

    comments: {
        type: String
    }
});

module.exports = mongoose.model('Upload', uploadSchema);

