var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

// api/v1.0/discover?page=1
router.get('/', function(req, res, next){
	var nextPage = req.query.page;
	if(nextPage == null) nextPage = 1;

	//look at start and limit query param 
	// find recipes and order by id
	Recipe.paginate({}, {
		page: nextPage,
		columns: 'basic',
		limit: 10,
		sortBy: {
			_id: 1
		}
	}, function(err, results, pageCount, itemCount){
		if(err){
			next(err);
		}
		else {
			res.json({
				status: 200,
				page: nextPage,
				recipes: results
			});
		}
	});
});

module.exports = router;