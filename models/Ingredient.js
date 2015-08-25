var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
	name: {type: String, lowercase: true},
	recipes: [{type: mongoose.Schema.ObjectId, ref: 'Recipe'}]
});

module.exports = mongoose.model('Ingredient', IngredientSchema);