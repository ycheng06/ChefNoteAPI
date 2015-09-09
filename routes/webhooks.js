var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

/* hook for epicurious api */
router.post('/epicurious', function(req, res, next) {
	var isSuccessful = insertDataFromKimonoAPI(req, "Epicurious");

	if (isSuccessful){
		res.send("recipe webhook update sucessful");
	}
	else{
		res.send("recipe webhook update canceled");
	}
});

router.post('/chow', function(req, res, next) {
	var isSucessful = insertDataFromKimonoAPI(req, "Chow");

	if (isSuccessful){
		res.send("recipe webhook update sucessful");
	}
	else{
		res.send("recipe webhook update canceled");
	}
});

router.post('/norecipes', function(req, res, next){
	var isSuccessful = insertDataFromKimonoAPI(req, "NoRecipes");

	if (isSuccessful){
		res.send("recipe webhook update sucessful");
	}
	else{
		res.send("recipe webhook update canceled");
	}
});

function insertDataFromKimonoAPI(request, defaultPublisher){
	//check if data is new
	var isNewData = request.body.newdata;
	if (!isNewData){
		return false;
	}
	else {
		//check for empty results first
		var results = request.body.results;
		results.forEach(function(result){

			// Run a query to search for the recipe in db first
			var query = Recipe.where({'basic.url':result.url});
			query.findOne(function(err, recipe){
				if(err) handleError(err);

				// Insert recipe if not in db
				if(recipe == null){
					var recipe = new Recipe; // Create instance from model
					var basicInfo = result.basicInfo;

					// Set the recipe url
					recipe.basic.url = result.url;

					if(basicInfo != null){
						var info = basicInfo[0];
						// Photo... skip this recipe if it doesn't have photo
						var photo = info.photo;

						if(photo != null)
							recipe.basic.photo = photo.src;
						else
							return; 

						// Title... skip recipe if it doesn't have a title
						var title = info.name;
						if(title != null)
							recipe.basic.title = title;
						else
							return;

						// Yield (how many servings)
						var yield = info.yeild;
						if(yield != null) 
							recipe.basic.yield = String(yield);

				  		// Total Time
				  		var totalTime = info.totalTime;
				  		if(totalTime != null)
							recipe.basic.totalTime = String(totalTime);

						// Publisher
						var publisher = info.publisher;
						if(publisher != null)
							recipe.basic.publisher = String(publisher);
						else
							recipe.basic.publisher = defaultPublisher;

						// Author
						var author = info.author;
						if(author != null)
							recipe.basic.author = String(author);

					}
					else{
						// Skip recipe if basic info doesn't exist... bad data
						return;
					}

					var ingredients = result.ingredients;
					if(ingredients != null){
						ingredients.forEach(function(step){

							var ingredientString = ""
							if(defaultPublisher == "NoRecipes"){
								ingredientString = step.quantity + " " + step.unit + " " + step.ingredient;
							}
							else {
								ingredientString = step.ingredient;
							}

							recipe.ingredients.push(String(ingredientString));
						});
					}

					// Directions
					var directions = result.directions;
					if(directions != null){
				  		directions.forEach(function(step){
				  			recipe.directions.push(String(step.direction));
				  		});
					}

					recipe.save(function(err, product, numberAffected){
						if(err){
							console.error(err);
						}
						
					});
				}
			});
		});
		return true;
	}
}

module.exports = router;