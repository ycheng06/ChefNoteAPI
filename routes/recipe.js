var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

// api/v1.0/recipe/:recipeId
router.get('/:recipeId', function(req, res, next){
	var recipeId = req.params.recipeId;
	console.log(recipeId);

	// Find recipe with recipeId
	if(recipeId){
		var query = Recipe.where({ _id:recipeId}).select('url title yield totalTime photo publisher ingredients directions');
		query.findOne(function(err, recipe){
			if(err){
				next(err);
			} 
			else {
				res.json({
					status: 200,
					result: recipe	
				});
			}
		});
	}
	else{
		res.status(500);
		res.json({
			status: 500,
			result: 'Not Found'
		});
	}
});

// api/v1.0/recipe/recipes
router.post('/recipes', function(req, res, next){
	var recipeIds = req.body.recipeIds

	if(recipeIds.length > 0){
		var query = Recipe.where({_id: {$in: recipeIds}}).select('basic');
		query.find(function(err, recipes){
			console.log(recipes);
			res.json({
				status: 200,
				result: recipes 
			});
		});
	}
	else {
		res.status(500);
		res.json({
			status: 500,
			result: 'Not Found'
		});
	}
});

module.exports = router;