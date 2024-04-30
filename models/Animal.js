const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    Espèce: String,
    Description: String,
    'Nom latin': String,
    Famille: String,
    Région: String,
    Habitat: String,
    'Fun fact': String,
    Min_size: Number,
    Max_size: Number,
    Latitude: Number,
    Longitude: Number
});


const Animal = mongoose.model('Animal', animalSchema, 'Animal');

module.exports = Animal;

