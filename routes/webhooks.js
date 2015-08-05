var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

/* hook for epicurious api */
router.post('/epicurious', function(req, res, next) {

	var results = req.body.results;

	insertDataFromKimonoAPI(results);

	res.send("successful");
});

router.post('/chow', function(req, res, next) {

	var results = req.body.results;

	insertDataFromKimonoAPI(results);

	res.send("successful");
});

function insertDataFromKimonoAPI(results){
	results.forEach(function(result){

		// Run a query to search for the recipe in db first
		var query = Recipe.where({url:result.url});
		query.findOne(function(err, recipe){
			if(err) handleError(err);

			// Insert recipe if not in db
			if(recipe == null){
				console.log(result.page);
				var recipe = new Recipe; // Create instance from model
				var basicInfo = result.basicInfo;

				// Set the recipe url
				recipe.url = result.url;

				if(basicInfo != null){
					recipe.title = basicInfo[0].name;

					// Yield (how many servings)
					var yield = basicInfo[0].yeild;
					if(yield != null) 
						recipe.yield = String(yield);

			  		// Total Time
			  		var totalTime = basicInfo[0].totalTime;
			  		if(totalTime != null)
						recipe.totalTime = String(totalTime);

					// Publisher
					var publisher = basicInfo[0].publisher;
					if(publisher != null)
						recipe.publisher = String(publisher);

					// Author
					var author = basicInfo[0].author;
					if(author != null)
						recipe.author = String(author);

					// Photo
					var photo = basicInfo[0].photo;
					if(photo != null)
						recipe.photo = photo.src;
				}

				var ingredients = result.ingredients;
				if(ingredients != null){
					ingredients.forEach(function(step){
						recipe.ingredients.push(String(step.ingredient));
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
}

module.exports = router;