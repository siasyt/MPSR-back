const tf = require('@tensorflow/tfjs-node');

async function loadModel(modelPath) {
    try {
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading the model:', error);
        throw error;
    }
}


function preprocessImage(imageBuffer) {
    try {
        const tfimage = tf.node.decodeImage(imageBuffer, 3);
        const resizedImage = tf.image.resizeBilinear(tfimage, [224, 224]);
        const normalizedImage = resizedImage.div(255.0).expandDims();
        return normalizedImage;
    } catch (error) {
        console.error('Error preprocessing image:', error);
        throw error;
    }
}


async function predict(model, imageData) {
    try {
        const predictionTensor = model.predict(imageData);
        const probabilities = await predictionTensor.data();
        return probabilities;
    } catch (error) {
        console.error('Error predicting:', error);
        throw error;
    }
}

module.exports = {
    loadModel,
    preprocessImage,
    predict
};



