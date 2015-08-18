var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var RecipeSchema = new mongoose.Schema({
	basic: {
		title: String,
		yield: String,
		totalTime: String,
		publisher: String,
		author: String,
		photo: String, 
		url: String
	},
	ingredients: [String],
	directions: [String],
	createdAt: {type: Date, default: Date.now},
	updateAt: {type: Date, default: Date.now}
});

RecipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', RecipeSchema);