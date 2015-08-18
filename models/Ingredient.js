var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
	name: String,
	recipes: [{type: Schema.ObjectId, ref: 'Recipe'}];
});

module.exports = mongoose.model('Ingredient', IngredientSchema);