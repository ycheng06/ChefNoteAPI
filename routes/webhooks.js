var express = require('express');
var request = require('request');
var router = express.Router();

/* hook for epicurious api */
router.get('/epicurious', function(req, res, next) {
	request("https://www.kimonolabs.com/api/5fpg89am?apikey=wUANf1zolrItZ6e9dr7BrnRxdFEBK7Gb", 
	function(err, response, body) {
  		console.log(body);
  		res.send(body);
	}); 
});

module.exports = router;