// back/routes/imageProcessing.js

const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
const Animal = require('../models/Animal');
const Upload = require('../models/Upload');
const path = require('path');
const modelPath = path.resolve(__dirname, '..', 'Animal_Model', 'model.json');
const labelsPath = path.resolve(__dirname, '..', 'Animal_Model', 'metadata.json');
let model;
let labels;

async function loadLabels() {
    try {
        const labelsJSON = await fs.readFile(labelsPath, 'utf-8');
        labels = JSON.parse(labelsJSON).labels;
        console.log('Labels loaded successfully:', labels);
    } catch (error) {
        console.error('Error loading labels:', error);
        throw error;
    }
}

async function loadModel() {
    try {
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error;
    }
}

loadLabels();
loadModel();

loadLabels();
loadModel();

router.post('/process-image', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const imageFile = req.files.image;
        const uploadFolderPath = path.resolve(__dirname, '..', 'uploads');
        const savePath = path.join(uploadFolderPath, imageFile.name);
        await imageFile.mv(savePath);

        console.log('Image saved to:', savePath);

        const imageBuffer = await fs.readFile(savePath);
        const tfimage = tf.node.decodeImage(imageBuffer, 3);
        const resizedImage = tf.image.resizeBilinear(tfimage, [224, 224]);
        const normalizedImage = resizedImage.div(255.0).expandDims();
        const predictionTensor = model.predict(normalizedImage);
        const probabilities = predictionTensor.dataSync();

        console.log('Probabilities:', probabilities);

        const labelProbabilities = labels.map((label, index) => ({
            species: label,
            probability: parseFloat(probabilities[index].toFixed(2))
        }));
        labelProbabilities.sort((a, b) => b.probability - a.probability);

        console.log('Label probabilities:', labelProbabilities);

        const highestProbabilitySpecies = labelProbabilities[0].species;
        const animalInfo = await Animal.findOne({ 'Espèce': highestProbabilitySpecies });

        if (!animalInfo) {
            console.error('Animal not found in the database for label:', highestProbabilitySpecies);
            return res.status(404).send('Animal not found');
        }


        const mapLink = `https://www.google.com/maps/search/?api=1&query=${animalInfo.Latitude},${animalInfo.Longitude}`;

        console.log('Latitude:', animalInfo.Latitude);
        console.log('Longitude:', animalInfo.Longitude);


        console.log('Map link:', mapLink);

        const newUpload = new Upload({
            photoPath: savePath,
            predictedAnimal: highestProbabilitySpecies, 
            imageInfo: {
                size: imageFile.size,
                mimetype: imageFile.mimetype
            },
            latitude: animalInfo.Latitude, 
            longitude: animalInfo.Longitude,
            description: animalInfo.Description,
            metadata: labelProbabilities, 
            mapLink: mapLink 
        });
        await newUpload.save();

        console.log('Label probabilities:', labelProbabilities);
        console.log('Highest probability species:', highestProbabilitySpecies);
        console.log('Animal info:', animalInfo);


        res.json({
            success: true,
            predictedLabel: highestProbabilitySpecies, 
            animalInfo,
            probabilities: labelProbabilities,
            uploadId: newUpload._id,
            mapLink: mapLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image');
    }
});

router.get('/uploads', async (req, res) => {
    try {
        const uploads = await Upload.find({});
        console.log('Retrieved uploads:', uploads); 
        res.json(uploads);
    } catch (error) {
        console.error('Failed to retrieve uploads:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;



