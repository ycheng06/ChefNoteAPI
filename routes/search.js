var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

// api/v1.0/search?keyword='basil'
router.get('/', function(req, res, next){
	var keyword = req.query.keyword;

	var query = Recipe.where({$text: {$search: '\"' + keyword + '\"'}});

	query.find(function(err, output){
		if(err){
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
