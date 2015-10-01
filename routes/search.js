var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

// api/v1.0/search?keyword='basil'
router.get('/', function(req, res, next){
	var keyword = req.query.keyword;

	// using text search to search for ingredients
	var query = Recipe.where({$text: {$search: '\"' + keyword + '\"'}}).select('basic');

	query.find(function(err, output){
		if(err){
			// console.log(err)
			next(err);
		}
		else {
			res.json({
				status: 200,
				recipes: output
			});
		}
	});
});

module.exports = router;
