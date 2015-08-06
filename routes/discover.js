var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Recipe = require('../models/Recipe.js');

// api/v1/discover?page=1
router.get('/', function(req, res, next){
	var nextPage = req.query.page;
	if(nextPage == null) nextPage = 1;

	//look at start and limit query param 
	// find recipes and order by id
	Recipe.paginate({}, {
		page: nextPage,
		columns: 'url title yield totalTime photo publisher ingredients directions',
		limit: 10,
		sortBy: {
			_id: 1
		}
	}, function(err, results, pageCount, itemCount){
		if(err){
			res.status(500);
			res.send("error");
		}
		else {
			res.json({
				page: nextPage,
				recipes: results
			});
		}
	});
});

module.exports = router;